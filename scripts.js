// --- Sidebar Toggle Logic ---
let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

/**
 * Opens the responsive sidebar overlay.
 */
function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    requestAnimationFrame(() => {
         sidebar.classList.add('open');
    });
    sidebarOpen = true;
  }
}

/**
 * Closes the responsive sidebar overlay.
 */
function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('open');
     setTimeout(() => {
         if (!sidebar.classList.contains('open')) {
            sidebar.classList.remove('sidebar-responsive');
         }
     }, 500); // Match CSS transition duration
    sidebarOpen = false;
  }
}

// --- Global Variables ---
let allPromptsData = {}; // Stores prompts categorized { categoryKey: [promptObjects] }
let categoryCounts = []; // Stores { key, name, icon, count } for dashboard cards
let flatPrompts = []; // Stores [{ title, prompt, language, category }, ...] for search functionality

// --- DOM Elements ---
const promptDisplayArea = document.getElementById('prompt-display-area');
const sidebarListItems = document.querySelectorAll('.sidebar-list-item');
const mainContentTitle = document.getElementById('main-content-title');
const dashboardSummaryContainer = document.getElementById('dashboard-summary-cards'); // Summary Card Container
const dashboardCardsContainer = document.getElementById('dashboard-cards'); // Category Card Container
const promptContainer = document.getElementById('prompt-container'); // Prompt Display Wrapper
const searchInput = document.getElementById('search-input');
const searchPredictions = document.getElementById('search-predictions');

// --- Utility Functions ---

/**
 * Flattens the categorized prompt data into a single array for easier searching.
 * Each item includes its original category key. Called after data is loaded.
 */
function createFlatPromptList() {
    flatPrompts = []; // Reset the flat list
    for (const categoryKey in allPromptsData) {
        if (Object.prototype.hasOwnProperty.call(allPromptsData, categoryKey)) {
            if (Array.isArray(allPromptsData[categoryKey])) {
                allPromptsData[categoryKey].forEach(prompt => {
                    // Basic validation to ensure prompt has a title
                    if (prompt && typeof prompt.title === 'string') {
                        flatPrompts.push({
                            ...prompt, // Copy existing prompt properties
                            category: categoryKey // Add the category key
                        });
                    } else {
                        console.warn(`Skipping invalid prompt object in category "${categoryKey}":`, prompt);
                    }
                });
            } else {
                 console.warn(`Data for category "${categoryKey}" is not an array.`);
            }
        }
    }
    // console.log("Flat prompt list created:", flatPrompts.length, "prompts"); // For debugging
}

/**
 * Calculates the number of prompts per category based on loaded data
 * and sidebar item information. Populates the global categoryCounts array.
 */
function calculateCategoryCounts() {
    categoryCounts = []; // Reset before recalculating
    sidebarListItems.forEach(item => {
        const categoryKey = item.getAttribute('data-category');
        if (!categoryKey || categoryKey === 'dashboard') return;

        const link = item.querySelector('a');
        const iconElement = link?.querySelector('.material-icons-outlined');
        const categoryName = link?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey;
        const iconName = iconElement?.textContent.trim() || 'category';
        const count = allPromptsData[categoryKey]?.length || 0;

        categoryCounts.push({
            key: categoryKey,
            name: categoryName,
            icon: iconName,
            count: count
        });
    });
}


// --- Display Functions ---

/**
 * Displays the Dashboard view including summary and category cards.
 */
function displayDashboard() {
    mainContentTitle.textContent = "Dashboard";
    promptContainer.style.display = 'none'; // Hide prompt area
    dashboardSummaryContainer.innerHTML = ''; // Clear previous summary cards
    dashboardCardsContainer.innerHTML = '';   // Clear previous category cards
    dashboardSummaryContainer.style.display = 'grid'; // Show summary grid
    dashboardCardsContainer.style.display = 'grid';   // Show category grid

    // --- Create and Add Summary Cards ---
    // Ensure counts and flat list are ready before creating summary cards
    if (flatPrompts.length === 0 || categoryCounts.length === 0) {
         if (Object.keys(allPromptsData).length > 0) {
             // Data loaded, but counts missing? Recalculate.
             createFlatPromptList(); // Ensure flat list is created too
             calculateCategoryCounts();
         } else {
            // Data not loaded yet
            dashboardSummaryContainer.innerHTML = "<p>Loading summary...</p>";
            dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading categories...</p>";
            // If loadPrompts failed, the error message is already handled there.
            return; // Exit if data/counts aren't ready
         }
    }

    // Card 1: Total Prompts
    const totalPromptsCard = document.createElement('div');
    totalPromptsCard.className = 'card summary-card total-prompts';
    const tpInner = document.createElement('div');
    tpInner.className = 'card-inner';
    const tpTitle = document.createElement('h3');
    tpTitle.textContent = 'Total Prompts';
    const tpIcon = document.createElement('span');
    tpIcon.className = 'material-icons-outlined';
    tpIcon.textContent = 'list_alt';
    tpInner.appendChild(tpTitle);
    tpInner.appendChild(tpIcon);
    const tpCount = document.createElement('h1');
    tpCount.textContent = flatPrompts.length; // Use length of the generated flat list
    totalPromptsCard.appendChild(tpInner);
    totalPromptsCard.appendChild(tpCount);
    dashboardSummaryContainer.appendChild(totalPromptsCard);

    // Card 2: Total Categories
    const totalCatsCard = document.createElement('div');
    totalCatsCard.className = 'card summary-card total-categories';
    const tcInner = document.createElement('div');
    tcInner.className = 'card-inner';
    const tcTitle = document.createElement('h3');
    tcTitle.textContent = 'Total Categories';
    const tcIcon = document.createElement('span');
    tcIcon.className = 'material-icons-outlined';
    tcIcon.textContent = 'category';
    tcInner.appendChild(tcTitle);
    tcInner.appendChild(tcIcon);
    const tcCount = document.createElement('h1');
    tcCount.textContent = categoryCounts.length; // Use length of category counts array
    totalCatsCard.appendChild(tcInner);
    totalCatsCard.appendChild(tcCount);
    dashboardSummaryContainer.appendChild(totalCatsCard);


    // --- Create and Add Category Cards (From categoryCounts) ---
    if (categoryCounts.length > 0) {
        categoryCounts.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'card category-card';
            card.setAttribute('data-category-key', cat.key);

            const cardInner = document.createElement('div');
            cardInner.className = 'card-inner';
            const title = document.createElement('h3');
            title.textContent = cat.name;
            const iconSpan = document.createElement('span');
            iconSpan.className = 'material-icons-outlined';
            iconSpan.textContent = cat.icon;
            cardInner.appendChild(title);
            cardInner.appendChild(iconSpan);

            const countH1 = document.createElement('h1');
            countH1.textContent = cat.count;

            card.appendChild(cardInner);
            card.appendChild(countH1);

            card.addEventListener('click', () => {
                 const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${cat.key}"]`);
                 if (sidebarItem) {
                     sidebarItem.click();
                 } else {
                     console.warn(`Dashboard card click: Sidebar item for category key "${cat.key}" not found.`);
                 }
            });
            dashboardCardsContainer.appendChild(card); // Append to category container
        });
    } else if (Object.keys(allPromptsData).length > 0) {
        // Data loaded, but somehow no categories were processed
         dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>No categories found or processed.</p>";
    } else {
        // Still loading or error handled by loadPrompts
         dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading categories...</p>";
    }
}


/**
 * Displays the prompts for a specific category, optionally highlighting one.
 * @param {string} categoryKey - The key of the category to display.
 * @param {string} [promptToHighlight] - Optional title of a prompt to highlight after display.
 */
function displayPrompts(categoryKey, promptToHighlight = null) {
    const categoryElement = document.querySelector(`.sidebar-list-item[data-category="${categoryKey}"] a`);
    const iconElement = categoryElement?.querySelector('.material-icons-outlined');
    const categoryName = categoryElement?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
    mainContentTitle.textContent = `${categoryName} Prompts`;

    // Hide dashboard sections, show prompts section
    dashboardSummaryContainer.style.display = 'none';
    dashboardCardsContainer.style.display = 'none';
    promptContainer.style.display = 'block';
    promptDisplayArea.innerHTML = ''; // Clear previous prompts

    const prompts = allPromptsData[categoryKey];

    if (prompts && prompts.length > 0) {
        prompts.forEach(p => {
            if (!p || typeof p.title !== 'string') {
                console.warn(`Skipping rendering of invalid prompt object in category "${categoryKey}":`, p);
                return;
            }
            const card = document.createElement('div');
            card.className = 'prompt-card';
            card.dataset.promptTitle = p.title;

            const cardHeader = document.createElement('div');
            cardHeader.className = 'prompt-card-header';
            const title = document.createElement('h5');
            title.className = 'prompt-card-title';
            title.textContent = p.title;
            cardHeader.appendChild(title);
            card.appendChild(cardHeader);

            const codeContainer = document.createElement('div');
            codeContainer.className = 'code-toolbar';
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${p.language || 'text'}`;
            code.textContent = p.prompt || '';
            pre.appendChild(code);
            codeContainer.appendChild(pre);
            card.appendChild(codeContainer);
            promptDisplayArea.appendChild(card);
        });

        // Trigger Prism highlighting after elements are in the DOM
        setTimeout(() => {
            if (typeof Prism !== 'undefined' && Prism.highlightAllUnder) {
                Prism.highlightAllUnder(promptDisplayArea);
            } else {
                console.warn("PrismJS not fully loaded, skipping highlighting.");
            }
            if (promptToHighlight) {
                setTimeout(() => {
                    scrollToAndHighlightPrompt(promptToHighlight);
                }, 100);
             }
        }, 50);

    } else if (Object.keys(allPromptsData).length === 0 && !promptDisplayArea.querySelector('.text-danger')) {
        // Handle case where data might still be loading
        promptDisplayArea.innerHTML = '<p>Loading prompts...</p>';
    } else {
        // Handle case where category exists but has no prompts, or category key is invalid
        promptDisplayArea.innerHTML = `<p>No prompts found for the '${categoryName}' category.</p>`;
    }

    // Close sidebar on smaller screens after interaction
    if (window.innerWidth <= 992 && sidebarOpen) {
        closeSidebar();
    }
}

// --- Navigation & Highlighting ---

/**
 * Finds a prompt card DOM element by its title using the data attribute.
 * Uses CSS.escape for potentially special characters in titles.
 * @param {string} promptTitle - The title of the prompt to find.
 * @returns {HTMLElement|null} - The prompt card element or null if not found.
 */
function findPromptCardByTitle(promptTitle) {
    try {
        const escapedTitle = CSS.escape(promptTitle);
        return promptDisplayArea.querySelector(`.prompt-card[data-prompt-title="${escapedTitle}"]`);
    } catch (e) {
        console.error("Error finding prompt card with title:", promptTitle, e);
        return null;
    }
}

/**
 * Scrolls to and highlights a specific prompt card.
 * @param {string} promptTitle - The title of the prompt to highlight.
 */
function scrollToAndHighlightPrompt(promptTitle) {
    const targetCard = findPromptCardByTitle(promptTitle);
    if (targetCard) {
        document.querySelectorAll('.prompt-card.highlighted').forEach(el => el.classList.remove('highlighted'));
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
        targetCard.classList.add('highlighted');
        setTimeout(() => {
            if (targetCard && targetCard.classList.contains('highlighted')) {
                 targetCard.classList.remove('highlighted');
            }
        }, 2500); // Duration highlight stays
    } else {
        console.warn(`Prompt card with title "${promptTitle}" not found in DOM for highlighting.`);
    }
}

// --- Search Functionality ---

/**
 * Filters prompts based on search term (in title) and displays predictions.
 */
function handleSearchInput() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchPredictions.innerHTML = '';

    if (!searchTerm) {
        searchPredictions.style.display = 'none';
        return;
    }

    if (!flatPrompts || flatPrompts.length === 0) {
        console.warn("Search attempted before flatPrompts list was created.");
        searchPredictions.style.display = 'none';
        return;
    }

    const matchingPrompts = flatPrompts.filter(prompt =>
        prompt && typeof prompt.title === 'string' && prompt.title.toLowerCase().includes(searchTerm)
    );

    if (matchingPrompts.length > 0) {
        matchingPrompts.slice(0, 10).forEach(prompt => { // Limit results
            const item = document.createElement('div');
            item.className = 'prediction-item';
            item.textContent = prompt.title;
            item.dataset.category = prompt.category;
            item.dataset.title = prompt.title;
            item.addEventListener('click', handlePredictionClick);
            searchPredictions.appendChild(item);
        });
    } else {
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No results found';
        searchPredictions.appendChild(noResults);
    }

    searchPredictions.style.display = 'block';
}

/**
 * Handles clicking on a search prediction item. Navigates to the
 * category and highlights the specific prompt.
 * @param {Event} event - The click event object.
 */
function handlePredictionClick(event) {
    const targetItem = event.currentTarget;
    const categoryKey = targetItem.dataset.category;
    const promptTitle = targetItem.dataset.title;

    if (categoryKey && promptTitle) {
        const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${categoryKey}"]`);
        if (sidebarItem) {
            sidebarListItems.forEach(i => i.classList.remove('active'));
            sidebarItem.classList.add('active');
        } else {
            console.warn(`Prediction click: Sidebar item for category "${categoryKey}" not found.`);
        }

        displayPrompts(categoryKey, promptTitle); // Navigate and request highlight

        searchInput.value = ''; // Clear search
        searchPredictions.style.display = 'none'; // Hide predictions

        if (window.innerWidth <= 992 && sidebarOpen) { // Close mobile sidebar
             closeSidebar();
         }

    } else {
        console.error("Missing category or title data on clicked prediction item:", targetItem);
    }
}

// --- Data Loading ---

/**
 * Fetches prompt data from prompts.json, processes it, and displays the initial view.
 */
async function loadPrompts() {
  // Ensure containers exist before proceeding
  if (!dashboardSummaryContainer || !dashboardCardsContainer || !promptContainer) {
       console.error("Essential dashboard or prompt containers not found in the DOM.");
       return; // Stop execution if critical elements are missing
  }

  try {
    const response = await fetch('prompts.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}. Failed to fetch 'prompts.json'.`);
    allPromptsData = await response.json();
    console.log("Prompts data loaded successfully.");

    createFlatPromptList(); // Create the searchable list
    calculateCategoryCounts(); // Calculate counts for the dashboard

    displayDashboard(); // Display initial view

  } catch (error) {
    console.error("Error loading or processing prompts:", error);
    // Display error in both summary and category areas for visibility
    dashboardSummaryContainer.style.display = 'grid';
    dashboardCardsContainer.style.display = 'grid';
    promptContainer.style.display = 'none';
    dashboardSummaryContainer.innerHTML = `<p class="text-danger" style="color: var(--danger-color);">Error loading summary.</p>`;
    dashboardCardsContainer.innerHTML = `
        <p class="text-danger" style="grid-column: 1 / -1; color: var(--danger-color); padding: 20px; background-color: var(--bg-dark-secondary); border-radius: 5px;">
            <strong>Error loading prompts:</strong> ${error.message}. Please check if 'prompts.json' exists and is valid JSON.
        </p>`;
  }
}


// --- Event Listeners Setup ---

/**
 * Attaches all necessary event listeners after the DOM is loaded.
 */
function setupEventListeners() {
    // --- Sidebar Navigation ---
    if (sidebarListItems.length > 0) {
        sidebarListItems.forEach(item => {
          item.addEventListener('click', (event) => {
            event.preventDefault();
            sidebarListItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const category = item.getAttribute('data-category');

            if (category === 'dashboard') {
                if(Object.keys(allPromptsData).length > 0) {
                     if(categoryCounts.length === 0) calculateCategoryCounts(); // Ensure counts are ready
                     displayDashboard();
                } else { console.warn("Dashboard clicked before data loaded."); /* Show loading state maybe */ }
            } else if (category) {
                if (Object.keys(allPromptsData).length > 0) {
                    displayPrompts(category);
                } else { console.warn("Prompt category clicked before data loaded."); /* Show loading state */ }
            } else { console.warn("Clicked sidebar item missing 'data-category' attribute."); }

            if (window.innerWidth <= 992 && sidebarOpen) closeSidebar();
            if (searchInput) searchInput.value = ''; // Clear search on sidebar navigation
            if (searchPredictions) searchPredictions.style.display = 'none';
          });
        });
    } else {
        console.warn("No sidebar list items found to attach listeners.");
    }

    // --- Sidebar Overlay Closing ---
    document.addEventListener('click', function(event) {
      if (!sidebarOpen) return;
      const isMenuIcon = event.target.closest('.menu-icon');
      const isInsideSidebar = sidebar.contains(event.target);
      if (!isMenuIcon && !isInsideSidebar) {
        closeSidebar();
      }
    });

    // --- Search Functionality Listeners ---
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    } else {
        console.error("Search input element (#search-input) not found.");
    }

    // Hide search predictions when clicking anywhere outside the search wrapper
    document.addEventListener('click', function(event) {
        const isClickInsideSearchWrapper = event.target.closest('.search-wrapper');
        if (!isClickInsideSearchWrapper && searchPredictions) {
            searchPredictions.style.display = 'none';
        }
    });

    // Hide search predictions on Escape key press
    document.addEventListener('keydown', function(event) {
        if ((event.key === 'Escape' || event.key === 'Esc') && searchPredictions) {
            searchPredictions.style.display = 'none';
        }
    });
}

// --- Initial Application Load ---
// Wait for the DOM to be fully loaded before setting up listeners and loading data
document.addEventListener('DOMContentLoaded', () => {
    // Ensure essential DOM elements exist before proceeding
     if (!sidebar || !mainContentTitle || !dashboardSummaryContainer || !dashboardCardsContainer || !promptContainer) {
          console.error("One or more critical layout elements are missing. Aborting script initialization.");
          // Optionally display an error message to the user in the body
          document.body.innerHTML = "<p style='color: red; padding: 20px;'>Error: Application UI elements missing. Cannot initialize.</p>";
          return;
     }
    setupEventListeners(); // Attach listeners
    loadPrompts();       // Load data and display initial view
});
