// --- Sidebar Toggle Logic ---
let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

/**
 * Opens the responsive sidebar overlay.
 */
function openSidebar() {
  if (!sidebarOpen) {
    // Use classList add/remove for transitions defined in CSS
    sidebar.classList.add('sidebar-responsive');
    // Add 'open' class to trigger the CSS transition defined for it
    // Use requestAnimationFrame to ensure the 'sidebar-responsive' class is applied first,
    // allowing the transition on 'left' (or transform) to work correctly.
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
    // Remove the base class after transition duration using setTimeout
    // or listen for the 'transitionend' event for a more robust solution.
     setTimeout(() => {
         // Only remove if it hasn't been rapidly re-opened
         if (!sidebar.classList.contains('open')) {
            sidebar.classList.remove('sidebar-responsive');
         }
     }, 500); // Match CSS transition duration (adjust if CSS changes)
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
const dashboardCardsContainer = document.getElementById('dashboard-cards');
const promptContainer = document.getElementById('prompt-container');
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
        // Ensure it's a direct property and not from the prototype chain
        if (Object.prototype.hasOwnProperty.call(allPromptsData, categoryKey)) {
            // Check if the category value is an array before iterating
            if (Array.isArray(allPromptsData[categoryKey])) {
                allPromptsData[categoryKey].forEach(prompt => {
                    flatPrompts.push({
                        ...prompt, // Copy existing prompt properties (title, prompt, language)
                        category: categoryKey // Add the category key for context
                    });
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

        // Skip the dashboard item itself when creating category cards
        if (!categoryKey || categoryKey === 'dashboard') return;

        const link = item.querySelector('a');
        const iconElement = link?.querySelector('.material-icons-outlined');
        // Extract category name robustly from link text, removing icon text
        const categoryName = link?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey;
        const iconName = iconElement?.textContent.trim() || 'category'; // Default icon if not found

        // Get count from the loaded data, default to 0 if category not in data or has no prompts
        const count = allPromptsData[categoryKey]?.length || 0;

        // Store the collected info for the dashboard card
        categoryCounts.push({
            key: categoryKey,
            name: categoryName,
            icon: iconName,
            count: count
        });
    });
    // console.log("Calculated Category Counts:", categoryCounts); // For debugging
}


// --- Display Functions ---

/**
 * Displays the Dashboard view with category summary cards.
 */
function displayDashboard() {
    mainContentTitle.textContent = "Dashboard"; // Set the main title
    promptContainer.style.display = 'none'; // Hide the prompt display area
    dashboardCardsContainer.innerHTML = ''; // Clear any existing dashboard cards
    dashboardCardsContainer.style.display = 'grid'; // Ensure the dashboard grid is visible

    // Recalculate counts just in case, though should be done after load
    if (categoryCounts.length === 0 && Object.keys(allPromptsData).length > 0) {
        calculateCategoryCounts();
    }

    // Check if category counts are available
    if (categoryCounts.length === 0) {
        dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading category information...</p>";
        return;
    }

    // Create a card for each category
    categoryCounts.forEach(cat => {
        const card = document.createElement('div');
        card.className = 'card category-card'; // Use defined styles
        card.setAttribute('data-category-key', cat.key); // Store key for click navigation

        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';
        const title = document.createElement('h3');
        title.textContent = cat.name; // Category name
        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-icons-outlined';
        iconSpan.textContent = cat.icon; // Category icon
        cardInner.appendChild(title);
        cardInner.appendChild(iconSpan);

        const countH1 = document.createElement('h1');
        countH1.textContent = cat.count; // Number of prompts

        card.appendChild(cardInner);
        card.appendChild(countH1);

        // Add click listener to the card to navigate to the category view
        card.addEventListener('click', () => {
             const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${cat.key}"]`);
             if (sidebarItem) {
                 sidebarItem.click(); // Simulate a click on the sidebar item
             } else {
                 console.warn(`Dashboard card click: Sidebar item for category key "${cat.key}" not found.`);
             }
        });

        dashboardCardsContainer.appendChild(card);
    });
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
    mainContentTitle.textContent = `${categoryName} Prompts`; // Update the main title

    // Toggle visibility: Hide dashboard, show prompts area
    dashboardCardsContainer.style.display = 'none';
    promptContainer.style.display = 'block';
    promptDisplayArea.innerHTML = ''; // Clear previous prompts

    const prompts = allPromptsData[categoryKey];

    if (prompts && prompts.length > 0) {
        // If prompts exist, create and display a card for each
        prompts.forEach(p => {
            const card = document.createElement('div');
            card.className = 'prompt-card'; // Style for individual prompt cards
            // Add prompt title as a data attribute for easier selection later
            card.dataset.promptTitle = p.title;

            const cardHeader = document.createElement('div');
            cardHeader.className = 'prompt-card-header';
            const title = document.createElement('h5');
            title.className = 'prompt-card-title';
            title.textContent = p.title; // Prompt title
            cardHeader.appendChild(title);
            card.appendChild(cardHeader);

            const codeContainer = document.createElement('div');
            codeContainer.className = 'code-toolbar';
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${p.language || 'text'}`;
            code.textContent = p.prompt;
            pre.appendChild(code);
            codeContainer.appendChild(pre);
            card.appendChild(codeContainer);
            promptDisplayArea.appendChild(card);
        });

        // Trigger PrismJS highlighting after adding cards to DOM
        setTimeout(() => {
            Prism.highlightAllUnder(promptDisplayArea);
             // If a specific prompt needs highlighting, do it after Prism runs
             if (promptToHighlight) {
                // A very short delay might sometimes be needed for complex DOM/Prism interactions
                setTimeout(() => {
                    scrollToAndHighlightPrompt(promptToHighlight);
                }, 50);
             }
        }, 0);

    } else if (Object.keys(allPromptsData).length === 0 && !promptDisplayArea.querySelector('.text-danger')) {
        // Handle case where data might still be loading
        promptDisplayArea.innerHTML = '<p>Loading prompts...</p>';
    } else {
        // Handle case where category exists but has no prompts, or category key is invalid
        promptDisplayArea.innerHTML = `<p>No prompts found for the '${categoryName}' category.</p>`;
    }

    // Close sidebar on mobile/tablet view after selecting a category
    if (window.innerWidth <= 992 && sidebarOpen) {
        closeSidebar();
    }
}

// --- Navigation & Highlighting ---

/**
 * Finds a prompt card DOM element by its title using the data attribute.
 * @param {string} promptTitle - The title of the prompt to find.
 * @returns {HTMLElement|null} - The prompt card element or null if not found.
 */
function findPromptCardByTitle(promptTitle) {
    // Use querySelector with the data attribute for direct selection
    return promptDisplayArea.querySelector(`.prompt-card[data-prompt-title="${CSS.escape(promptTitle)}"]`);
}

/**
 * Scrolls to and highlights a specific prompt card.
 * @param {string} promptTitle - The title of the prompt to highlight.
 */
function scrollToAndHighlightPrompt(promptTitle) {
    const targetCard = findPromptCardByTitle(promptTitle);
    if (targetCard) {
        // Remove highlight from any previously highlighted card
        document.querySelectorAll('.prompt-card.highlighted').forEach(el => el.classList.remove('highlighted'));

        // Scroll into view
        targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });

        // Add highlight class (ensure this class is defined in CSS)
        targetCard.classList.add('highlighted');

        // Optional: Remove highlight after a delay for temporary effect
        setTimeout(() => {
            // Check if the card still exists and has the class before removing
            if (targetCard && targetCard.classList.contains('highlighted')) {
                 targetCard.classList.remove('highlighted');
            }
        }, 2500); // Remove highlight after 2.5 seconds
    } else {
        console.warn(`Prompt card with title "${promptTitle}" not found in DOM after navigation.`);
    }
}

// --- Search Functionality ---

/**
 * Filters prompts based on search term (in title) and displays predictions.
 */
function handleSearchInput() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    searchPredictions.innerHTML = ''; // Clear previous predictions

    if (!searchTerm) {
        searchPredictions.style.display = 'none'; // Hide dropdown if search is empty
        return;
    }

    // Filter the flat list of prompts based on the search term in the title
    const matchingPrompts = flatPrompts.filter(prompt =>
        prompt.title.toLowerCase().includes(searchTerm)
    );

    if (matchingPrompts.length > 0) {
        // Limit the number of predictions shown (e.g., top 10)
        matchingPrompts.slice(0, 10).forEach(prompt => {
            const item = document.createElement('div');
            item.className = 'prediction-item';
            item.textContent = prompt.title; // Display prompt title
            // Store data needed for navigation on the element itself
            item.dataset.category = prompt.category; // Store category key
            item.dataset.title = prompt.title; // Store exact title
            item.addEventListener('click', handlePredictionClick); // Add click handler
            searchPredictions.appendChild(item);
        });
    } else {
        // Show a "No results" message if no prompts match
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.textContent = 'No results found';
        searchPredictions.appendChild(noResults);
    }

    searchPredictions.style.display = 'block'; // Show predictions container
}

/**
 * Handles clicking on a search prediction item. Navigates to the
 * category and highlights the specific prompt.
 * @param {Event} event - The click event object.
 */
function handlePredictionClick(event) {
    const targetItem = event.currentTarget; // The prediction item div that was clicked
    const categoryKey = targetItem.dataset.category;
    const promptTitle = targetItem.dataset.title;

    if (categoryKey && promptTitle) {
        // 1. Find and visually activate the corresponding sidebar item
        const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${categoryKey}"]`);
        if (sidebarItem) {
            sidebarListItems.forEach(i => i.classList.remove('active')); // Deactivate others
            sidebarItem.classList.add('active'); // Activate clicked one
        } else {
            console.warn(`Prediction click: Sidebar item for category "${categoryKey}" not found.`);
        }

        // 2. Display the prompts for the target category, passing the title to highlight
        displayPrompts(categoryKey, promptTitle);

        // 3. Clean up search UI
        searchInput.value = ''; // Clear the search input
        searchPredictions.style.display = 'none'; // Hide the predictions dropdown

         // 4. Close sidebar on mobile if open
        if (window.innerWidth <= 992 && sidebarOpen) {
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
  try {
    const response = await fetch('prompts.json'); // Assumes prompts.json is in the same directory as index.html
    if (!response.ok) {
        // Handle specific HTTP errors like 404
        throw new Error(`HTTP error! Status: ${response.status}. Failed to fetch 'prompts.json'.`);
    }
    // Parse the JSON data
    allPromptsData = await response.json();
    console.log("Prompts data loaded successfully.");

    // Process data *after* it's successfully loaded
    createFlatPromptList(); // Create the searchable list
    calculateCategoryCounts(); // Calculate counts for the dashboard

    // Display the initial view (Dashboard)
    displayDashboard();

  } catch (error) {
    // Handle errors during fetch, JSON parsing, or initial processing
    console.error("Error loading or processing prompts:", error);
    // Display a user-friendly error message in the main content area (dashboard initially)
    dashboardCardsContainer.style.display = 'grid'; // Ensure grid for message layout
    promptContainer.style.display = 'none'; // Hide prompt area
    // Use template literal for cleaner message formatting
    dashboardCardsContainer.innerHTML = `
        <p class="text-danger" style="grid-column: 1 / -1; color: #ff6d00; padding: 20px; background-color: #263043; border-radius: 5px;">
            <strong>Error loading prompts:</strong> ${error.message}. Please check if 'prompts.json' exists and is valid JSON.
        </p>`;
  }
}


// --- Event Listeners ---

// --- Sidebar Navigation ---
sidebarListItems.forEach(item => {
  item.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default anchor link behavior

    // Update active state in sidebar
    sidebarListItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    const category = item.getAttribute('data-category');

    // Navigate to the appropriate view
    if (category === 'dashboard') {
        // Ensure data/counts are ready before displaying dashboard
        if(Object.keys(allPromptsData).length > 0) { // Check if base data loaded
             if(categoryCounts.length === 0) calculateCategoryCounts(); // Recalculate if needed
             displayDashboard();
        } else {
            // Data not loaded yet, show loading state (or error if load failed)
            console.warn("Dashboard clicked before data loaded.");
            dashboardCardsContainer.style.display = 'grid';
            promptContainer.style.display = 'none';
            if (!dashboardCardsContainer.querySelector('.text-danger')) { // Avoid overwriting error message
                dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading data...</p>";
            }
        }
    } else if (category) {
        // Navigate to prompt category view
        if (Object.keys(allPromptsData).length > 0) {
            displayPrompts(category); // Don't highlight when clicking sidebar directly
        } else {
             console.warn("Prompt category clicked before data loaded.");
             promptContainer.style.display = 'block'; // Show prompt container
             dashboardCardsContainer.style.display = 'none'; // Hide dashboard
             promptDisplayArea.innerHTML = '<p>Loading prompts, please wait...</p>';
        }
    } else {
        console.warn("Clicked sidebar item missing 'data-category' attribute.");
    }

    // Close sidebar on smaller screens after interaction
    if (window.innerWidth <= 992 && sidebarOpen) closeSidebar();

    // Clear search and hide predictions when navigating via sidebar
    searchInput.value = '';
    searchPredictions.style.display = 'none';
  });
});

// --- Sidebar Overlay Closing ---
document.addEventListener('click', function(event) {
  // Only act if sidebar is open
  if (!sidebarOpen) return;

  // Check if the click target is the menu icon itself or an element inside it
  const isMenuIcon = event.target.classList.contains('menu-icon') || event.target.closest('.menu-icon');
  // Check if the click target is inside the sidebar element
  const isInsideSidebar = sidebar.contains(event.target);

  // If the click is NOT the menu icon and NOT inside the sidebar, close it
  if (!isMenuIcon && !isInsideSidebar) {
    closeSidebar();
  }
});

// --- Search Functionality Listeners ---
// Handle input typing in the search bar
searchInput.addEventListener('input', handleSearchInput);

// Hide search predictions when clicking anywhere outside the search wrapper
document.addEventListener('click', function(event) {
    const isClickInsideSearchWrapper = event.target.closest('.search-wrapper');
    if (!isClickInsideSearchWrapper) {
        searchPredictions.style.display = 'none'; // Hide predictions
    }
});

// Hide search predictions on Escape key press
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape' || event.key === 'Esc') { // Handle older browser variations
        searchPredictions.style.display = 'none';
        // Optionally blur the input to remove focus
        // searchInput.blur();
    }
});

// Focus listener for search input (optional: show recent searches or suggestions on focus)
// searchInput.addEventListener('focus', () => {
//     // Potentially show recent searches or trigger initial suggestions
//     // if (searchInput.value.trim()) handleSearchInput(); // Show suggestions if text already exists
//     console.log("Search focused");
// });


// --- Initial Application Load ---
// Start the entire process by fetching the prompt data.
// loadPrompts() handles subsequent steps like processing data and displaying the initial view.
document.addEventListener('DOMContentLoaded', loadPrompts);
// Using DOMContentLoaded ensures the script runs after the basic HTML structure is ready.
