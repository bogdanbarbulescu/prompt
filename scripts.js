// --- Sidebar Toggle Logic ---
let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

/** Opens the responsive sidebar overlay. */
function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    requestAnimationFrame(() => { sidebar.classList.add('open'); });
    sidebarOpen = true;
  }
}

/** Closes the responsive sidebar overlay. */
function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('open');
    setTimeout(() => { if (!sidebar.classList.contains('open')) { sidebar.classList.remove('sidebar-responsive'); } }, 500); // Match CSS transition
    sidebarOpen = false;
  }
}

// --- Global Variables ---
let allPromptsData = {}; // Stores { categoryKey: [promptObjects] }
let categoryCounts = []; // Stores { key, name, icon, count }
let flatPrompts = [];    // Stores [{ title, prompt, language, category }, ...]

// --- DOM Elements ---
const promptDisplayArea = document.getElementById('prompt-display-area');
const sidebarListItems = document.querySelectorAll('.sidebar-list-item');
const mainContentTitle = document.getElementById('main-content-title');
const dashboardSummaryContainer = document.getElementById('dashboard-summary-cards');
const dashboardCardsContainer = document.getElementById('dashboard-cards');
const promptContainer = document.getElementById('prompt-container');
const searchInput = document.getElementById('search-input');
const searchPredictions = document.getElementById('search-predictions');

// --- Utility Functions ---

/** Flattens prompt data for searching. */
function createFlatPromptList() {
    flatPrompts = [];
    for (const categoryKey in allPromptsData) {
        if (Object.prototype.hasOwnProperty.call(allPromptsData, categoryKey)) {
            if (Array.isArray(allPromptsData[categoryKey])) {
                allPromptsData[categoryKey].forEach(prompt => {
                    if (prompt && typeof prompt.title === 'string') {
                        flatPrompts.push({ ...prompt, category: categoryKey });
                    } else { console.warn(`Skipping invalid prompt object in category "${categoryKey}":`, prompt); }
                });
            } else { console.warn(`Data for category "${categoryKey}" is not an array.`); }
        }
    }
}

/** Calculates counts for dashboard cards. */
function calculateCategoryCounts() {
    categoryCounts = [];
    sidebarListItems.forEach(item => {
        const categoryKey = item.getAttribute('data-category');
        if (!categoryKey || categoryKey === 'dashboard') return;
        const link = item.querySelector('a');
        const iconElement = link?.querySelector('.material-icons-outlined');
        const categoryName = link?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey;
        const iconName = iconElement?.textContent.trim() || 'category';
        const count = allPromptsData[categoryKey]?.length || 0;
        categoryCounts.push({ key: categoryKey, name: categoryName, icon: iconName, count: count });
    });
}


// --- Display Functions ---

/** Displays the Dashboard view with summary and category cards. */
function displayDashboard() {
    mainContentTitle.textContent = "Dashboard";
    promptContainer.style.display = 'none';
    dashboardSummaryContainer.innerHTML = '';
    dashboardCardsContainer.innerHTML = '';
    dashboardSummaryContainer.style.display = 'grid';
    dashboardCardsContainer.style.display = 'grid';

    if (flatPrompts.length === 0 || categoryCounts.length === 0) {
         if (Object.keys(allPromptsData).length > 0) {
             createFlatPromptList();
             calculateCategoryCounts();
         } else {
            dashboardSummaryContainer.innerHTML = "<p>Loading summary...</p>";
            dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading categories...</p>";
            return;
         }
    }

    // Create Summary Cards (Total Prompts, Total Categories)
    const totalPromptsCard = document.createElement('div');
    totalPromptsCard.className = 'card summary-card total-prompts';
    totalPromptsCard.innerHTML = `
        <div class="card-inner">
            <h3>Total Prompts</h3>
            <span class="material-icons-outlined">list_alt</span>
        </div>
        <h1>${flatPrompts.length}</h1>`;
    dashboardSummaryContainer.appendChild(totalPromptsCard);

    const totalCatsCard = document.createElement('div');
    totalCatsCard.className = 'card summary-card total-categories';
    totalCatsCard.innerHTML = `
        <div class="card-inner">
            <h3>Total Categories</h3>
            <span class="material-icons-outlined">category</span>
        </div>
        <h1>${categoryCounts.length}</h1>`;
    dashboardSummaryContainer.appendChild(totalCatsCard);

    // Create Category Cards
    if (categoryCounts.length > 0) {
        categoryCounts.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'card category-card';
            card.setAttribute('data-category-key', cat.key);
            card.innerHTML = `
                <div class="card-inner">
                    <h3>${cat.name}</h3>
                    <span class="material-icons-outlined">${cat.icon}</span>
                </div>
                <h1>${cat.count}</h1>`;
            card.addEventListener('click', () => {
                 const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${cat.key}"]`);
                 if (sidebarItem) sidebarItem.click();
                 else console.warn(`Dashboard card click: Sidebar item for key "${cat.key}" not found.`);
            });
            dashboardCardsContainer.appendChild(card);
        });
    } else if (Object.keys(allPromptsData).length > 0) {
         dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>No categories found or processed.</p>";
    } else {
         dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading categories...</p>";
    }
}

/**
 * Displays the prompts for a specific category, optionally highlighting one.
 * **Includes logic to add a copy button to each prompt card header.**
 * @param {string} categoryKey - The key of the category to display.
 * @param {string} [promptToHighlight] - Optional title of a prompt to highlight after display.
 */
function displayPrompts(categoryKey, promptToHighlight = null) {
    const categoryElement = document.querySelector(`.sidebar-list-item[data-category="${categoryKey}"] a`);
    const iconElement = categoryElement?.querySelector('.material-icons-outlined');
    const categoryName = categoryElement?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);
    mainContentTitle.textContent = `${categoryName} Prompts`;

    dashboardSummaryContainer.style.display = 'none';
    dashboardCardsContainer.style.display = 'none';
    promptContainer.style.display = 'block';
    promptDisplayArea.innerHTML = '';

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

            // *** NEW: Create Copy Button ***
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'copy-prompt-btn';
            copyBtn.title = 'Copy Prompt Text'; // Tooltip text
            const copyIcon = document.createElement('span');
            copyIcon.className = 'material-icons-outlined';
            copyIcon.textContent = 'content_copy';
            copyBtn.appendChild(copyIcon);

            // *** NEW: Add Copy Functionality ***
            copyBtn.addEventListener('click', async (e) => {
                e.stopPropagation(); // Prevent potential event bubbling issues
                const promptText = p.prompt || ''; // Get the prompt text for this card
                try {
                    await navigator.clipboard.writeText(promptText);
                    // Visual feedback: Change icon to check and add class
                    copyIcon.textContent = 'check';
                    copyBtn.classList.add('copied');
                    // Revert after a short delay
                    setTimeout(() => {
                        copyIcon.textContent = 'content_copy';
                        copyBtn.classList.remove('copied');
                    }, 1500); // Revert after 1.5 seconds
                } catch (err) {
                    console.error('Failed to copy prompt: ', err);
                    // Optional: Add visual feedback for error (e.g., change icon to 'error')
                     copyIcon.textContent = 'error_outline';
                     setTimeout(() => { copyIcon.textContent = 'content_copy'; }, 2000);
                }
            });

            // Append title and button to header
            cardHeader.appendChild(title);
            cardHeader.appendChild(copyBtn); // *** Add button here ***
            card.appendChild(cardHeader);

            // --- Code Block Section (remains the same) ---
            const codeContainer = document.createElement('div');
            // Check if PrismJS plugin should handle this copy action instead/as well
            // If prompt language is text, maybe don't use code-toolbar?
            // For simplicity now, keeping both copy methods available.
            codeContainer.className = 'code-toolbar';
            const pre = document.createElement('pre');
            const code = document.createElement('code');
            code.className = `language-${p.language || 'text'}`;
            code.textContent = p.prompt || '';
            pre.appendChild(code);
            codeContainer.appendChild(pre);
            card.appendChild(codeContainer);
            // --- End Code Block Section ---

            promptDisplayArea.appendChild(card);
        });

        // Trigger Prism highlighting AFTER elements are in the DOM
        setTimeout(() => {
            if (typeof Prism !== 'undefined' && Prism.highlightAllUnder) {
                Prism.highlightAllUnder(promptDisplayArea);
            } else { console.warn("PrismJS not fully loaded, skipping highlighting."); }
            if (promptToHighlight) {
                setTimeout(() => { scrollToAndHighlightPrompt(promptToHighlight); }, 100);
             }
        }, 50);

    } else if (Object.keys(allPromptsData).length === 0 && !promptDisplayArea.querySelector('.text-danger')) {
        promptDisplayArea.innerHTML = '<p>Loading prompts...</p>';
    } else {
        promptDisplayArea.innerHTML = `<p>No prompts found for the '${categoryName}' category.</p>`;
    }

    if (window.innerWidth <= 992 && sidebarOpen) closeSidebar();
}


// --- Navigation & Highlighting ---
/** Finds a prompt card DOM element by its title */
function findPromptCardByTitle(promptTitle) { try { const escapedTitle = CSS.escape(promptTitle); return promptDisplayArea.querySelector(`.prompt-card[data-prompt-title="${escapedTitle}"]`); } catch (e) { console.error("Error finding prompt card with title:", promptTitle, e); return null; } }
/** Scrolls to and highlights a specific prompt card */
function scrollToAndHighlightPrompt(promptTitle) { const targetCard = findPromptCardByTitle(promptTitle); if (targetCard) { document.querySelectorAll('.prompt-card.highlighted').forEach(el => el.classList.remove('highlighted')); targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); targetCard.classList.add('highlighted'); setTimeout(() => { if (targetCard && targetCard.classList.contains('highlighted')) { targetCard.classList.remove('highlighted'); } }, 2500); } else { console.warn(`Prompt card with title "${promptTitle}" not found in DOM for highlighting.`); } }

// --- Search Functionality ---
/** Filters prompts based on search term and displays predictions */
function handleSearchInput() { const searchTerm = searchInput.value.trim().toLowerCase(); searchPredictions.innerHTML = ''; if (!searchTerm) { searchPredictions.style.display = 'none'; return; } if (!flatPrompts || flatPrompts.length === 0) { console.warn("Search attempted before flatPrompts list was created."); searchPredictions.style.display = 'none'; return; } const matchingPrompts = flatPrompts.filter(prompt => prompt && typeof prompt.title === 'string' && prompt.title.toLowerCase().includes(searchTerm) ); if (matchingPrompts.length > 0) { matchingPrompts.slice(0, 10).forEach(prompt => { const item = document.createElement('div'); item.className = 'prediction-item'; item.textContent = prompt.title; item.dataset.category = prompt.category; item.dataset.title = prompt.title; item.addEventListener('click', handlePredictionClick); searchPredictions.appendChild(item); }); } else { const noResults = document.createElement('div'); noResults.className = 'no-results'; noResults.textContent = 'No results found'; searchPredictions.appendChild(noResults); } searchPredictions.style.display = 'block'; }
/** Handles clicking on a search prediction item */
function handlePredictionClick(event) { const targetItem = event.currentTarget; const categoryKey = targetItem.dataset.category; const promptTitle = targetItem.dataset.title; if (categoryKey && promptTitle) { const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${categoryKey}"]`); if (sidebarItem) { sidebarListItems.forEach(i => i.classList.remove('active')); sidebarItem.classList.add('active'); } else { console.warn(`Prediction click: Sidebar item for category "${categoryKey}" not found.`); } displayPrompts(categoryKey, promptTitle); searchInput.value = ''; searchPredictions.style.display = 'none'; if (window.innerWidth <= 992 && sidebarOpen) { closeSidebar(); } } else { console.error("Missing category or title data on clicked prediction item:", targetItem); } }

// --- Data Loading ---
/** Fetches prompt data, processes it, and displays the initial view. */
async function loadPrompts() {
  if (!dashboardSummaryContainer || !dashboardCardsContainer || !promptContainer) { console.error("Essential dashboard or prompt containers not found in the DOM."); return; }
  try {
    const response = await fetch('prompts.json');
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}. Failed to fetch 'prompts.json'.`);
    allPromptsData = await response.json();
    console.log("Prompts data loaded successfully.");
    createFlatPromptList();
    calculateCategoryCounts();
    displayDashboard();
  } catch (error) {
    console.error("Error loading or processing prompts:", error);
    dashboardSummaryContainer.style.display = 'grid'; dashboardCardsContainer.style.display = 'grid'; promptContainer.style.display = 'none';
    dashboardSummaryContainer.innerHTML = `<p class="text-danger" style="color: var(--danger-color);">Error loading summary.</p>`;
    dashboardCardsContainer.innerHTML = `<p class="text-danger" style="grid-column: 1 / -1; color: var(--danger-color); padding: 20px; background-color: var(--bg-dark-secondary); border-radius: 5px;"> <strong>Error loading prompts:</strong> ${error.message}. Please check if 'prompts.json' exists and is valid JSON. </p>`;
  }
}


// --- Event Listeners Setup ---
/** Attaches all necessary event listeners after the DOM is loaded. */
function setupEventListeners() {
    // Sidebar Navigation
    if (sidebarListItems.length > 0) {
        sidebarListItems.forEach(item => {
          item.addEventListener('click', (event) => {
            event.preventDefault();
            sidebarListItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');
            const category = item.getAttribute('data-category');
            if (category === 'dashboard') { if(Object.keys(allPromptsData).length > 0) { if(categoryCounts.length === 0) calculateCategoryCounts(); displayDashboard(); } else { console.warn("Dashboard clicked before data loaded."); } }
            else if (category) { if (Object.keys(allPromptsData).length > 0) { displayPrompts(category); } else { console.warn("Prompt category clicked before data loaded."); } }
            else { console.warn("Clicked sidebar item missing 'data-category' attribute."); }
            if (window.innerWidth <= 992 && sidebarOpen) closeSidebar();
            if (searchInput) searchInput.value = '';
            if (searchPredictions) searchPredictions.style.display = 'none';
          });
        });
    } else { console.warn("No sidebar list items found."); }

    // Sidebar Overlay Closing
    document.addEventListener('click', function(event) { if (!sidebarOpen) return; const isMenuIcon = event.target.closest('.menu-icon'); const isInsideSidebar = sidebar.contains(event.target); if (!isMenuIcon && !isInsideSidebar) { closeSidebar(); } });

    // Search Functionality Listeners
    if (searchInput) { searchInput.addEventListener('input', handleSearchInput); }
    else { console.error("Search input element (#search-input) not found."); }
    document.addEventListener('click', function(event) { const isClickInsideSearchWrapper = event.target.closest('.search-wrapper'); if (!isClickInsideSearchWrapper && searchPredictions) { searchPredictions.style.display = 'none'; } });
    document.addEventListener('keydown', function(event) { if ((event.key === 'Escape' || event.key === 'Esc') && searchPredictions) { searchPredictions.style.display = 'none'; } });
}

// --- Initial Application Load ---
document.addEventListener('DOMContentLoaded', () => {
     if (!sidebar || !mainContentTitle || !dashboardSummaryContainer || !dashboardCardsContainer || !promptContainer) {
          console.error("One or more critical layout elements are missing. Aborting script initialization.");
          document.body.innerHTML = "<p style='color: red; padding: 20px;'>Error: Application UI elements missing. Cannot initialize.</p>";
          return;
     }
    setupEventListeners();
    loadPrompts();
});
