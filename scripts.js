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
    setTimeout(() => { if (!sidebar.classList.contains('open')) { sidebar.classList.remove('sidebar-responsive'); } }, 500);
    sidebarOpen = false;
  }
}

// --- Global Variables ---
let allPromptsData = {};
let categoryCounts = [];
let flatPrompts = [];
let currentModalPrompt = null; // Store the data of the prompt currently in the modal

// --- DOM Elements ---
const promptDisplayArea = document.getElementById('prompt-display-area');
const sidebarListItems = document.querySelectorAll('.sidebar-list-item');
const mainContentTitle = document.getElementById('main-content-title');
const dashboardSummaryContainer = document.getElementById('dashboard-summary-cards');
const dashboardCardsContainer = document.getElementById('dashboard-cards');
const promptContainer = document.getElementById('prompt-container');
const searchInput = document.getElementById('search-input');
const searchPredictions = document.getElementById('search-predictions');

// --- Modal DOM Elements ---
const modalOverlay = document.getElementById('prompt-modal-overlay');
const modalContent = modalOverlay?.querySelector('.modal-content'); // Use optional chaining
const modalCloseBtn = document.getElementById('modal-close-btn');
const modalPromptTitle = document.getElementById('modal-prompt-title');
const modalPromptInput = document.getElementById('modal-prompt-input');
const modalOriginalPromptText = document.getElementById('modal-original-prompt-text');
const modalResetBtn = document.getElementById('modal-reset-btn');
const modalSearchChatGPT = document.getElementById('modal-search-chatgpt');
const modalSearchGemini = document.getElementById('modal-search-gemini');
const modalSearchPerplexity = document.getElementById('modal-search-perplexity');


// --- Utility Functions ---
function createFlatPromptList() { /* ... (same as before) ... */ flatPrompts = []; for (const categoryKey in allPromptsData) { if (Object.prototype.hasOwnProperty.call(allPromptsData, categoryKey)) { if (Array.isArray(allPromptsData[categoryKey])) { allPromptsData[categoryKey].forEach(prompt => { if (prompt && typeof prompt.title === 'string') { flatPrompts.push({ ...prompt, category: categoryKey }); } else { console.warn(`Skipping invalid prompt object in category "${categoryKey}":`, prompt); } }); } else { console.warn(`Data for category "${categoryKey}" is not an array.`); } } } }
function calculateCategoryCounts() { /* ... (same as before) ... */ categoryCounts = []; sidebarListItems.forEach(item => { const categoryKey = item.getAttribute('data-category'); if (!categoryKey || categoryKey === 'dashboard') return; const link = item.querySelector('a'); const iconElement = link?.querySelector('.material-icons-outlined'); const categoryName = link?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey; const iconName = iconElement?.textContent.trim() || 'category'; const count = allPromptsData[categoryKey]?.length || 0; categoryCounts.push({ key: categoryKey, name: categoryName, icon: iconName, count: count }); }); }

// --- Display Functions ---

/** Displays the Dashboard view */
function displayDashboard() { /* ... (same as before, including summary cards) ... */ mainContentTitle.textContent = "Dashboard"; promptContainer.style.display = 'none'; dashboardSummaryContainer.innerHTML = ''; dashboardCardsContainer.innerHTML = ''; dashboardSummaryContainer.style.display = 'grid'; dashboardCardsContainer.style.display = 'grid'; if (flatPrompts.length === 0 || categoryCounts.length === 0) { if (Object.keys(allPromptsData).length > 0) { createFlatPromptList(); calculateCategoryCounts(); } else { dashboardSummaryContainer.innerHTML = "<p>Loading summary...</p>"; dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading categories...</p>"; return; } } const totalPromptsCard = document.createElement('div'); totalPromptsCard.className = 'card summary-card total-prompts'; totalPromptsCard.innerHTML = `<div class="card-inner"><h3>Total Prompts</h3><span class="material-icons-outlined">list_alt</span></div><h1>${flatPrompts.length}</h1>`; dashboardSummaryContainer.appendChild(totalPromptsCard); const totalCatsCard = document.createElement('div'); totalCatsCard.className = 'card summary-card total-categories'; totalCatsCard.innerHTML = `<div class="card-inner"><h3>Total Categories</h3><span class="material-icons-outlined">category</span></div><h1>${categoryCounts.length}</h1>`; dashboardSummaryContainer.appendChild(totalCatsCard); if (categoryCounts.length > 0) { categoryCounts.forEach(cat => { const card = document.createElement('div'); card.className = 'card category-card'; card.setAttribute('data-category-key', cat.key); card.innerHTML = `<div class="card-inner"><h3>${cat.name}</h3><span class="material-icons-outlined">${cat.icon}</span></div><h1>${cat.count}</h1>`; card.addEventListener('click', () => { const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${cat.key}"]`); if (sidebarItem) sidebarItem.click(); else console.warn(`Dashboard card click: Sidebar item for key "${cat.key}" not found.`); }); dashboardCardsContainer.appendChild(card); }); } else if (Object.keys(allPromptsData).length > 0) { dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>No categories found or processed.</p>"; } else { dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading categories...</p>"; } }

/**
 * Displays the prompts list for a category. Clicking a card opens the modal.
 */
function displayPrompts(categoryKey) {
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
            card.dataset.promptTitle = p.title; // Used for potential highlighting/finding

            // --- Card Header ---
            const cardHeader = document.createElement('div');
            cardHeader.className = 'prompt-card-header';
            const title = document.createElement('h5');
            title.className = 'prompt-card-title';
            title.textContent = p.title;
            const copyBtn = document.createElement('button');
            copyBtn.type = 'button';
            copyBtn.className = 'copy-prompt-btn';
            copyBtn.title = 'Copy Prompt Text';
            copyBtn.innerHTML = '<span class="material-icons-outlined">content_copy</span>';
            copyBtn.addEventListener('click', (e) => {
                e.stopPropagation(); // Don't trigger card click when copying from list
                copyPromptText(p.prompt || '', copyBtn.querySelector('.material-icons-outlined'));
            });
            cardHeader.appendChild(title);
            cardHeader.appendChild(copyBtn);
            card.appendChild(cardHeader);

            // --- Code Block (Prism) ---
            const codeContainer = document.createElement('div');
            codeContainer.className = 'code-toolbar'; // For Prism copy button
            const pre = document.createElement('pre');
            pre.className = `language-${p.language || 'text'}`; // Prism language class
            const code = document.createElement('code');
            code.textContent = p.prompt || '';
            pre.appendChild(code);
            codeContainer.appendChild(pre);
            card.appendChild(codeContainer);

            // --- *** MODIFIED: Click listener on the whole card to open modal *** ---
            card.addEventListener('click', () => {
                openPromptModal(p); // Pass the prompt data object
            });

            promptDisplayArea.appendChild(card);
        });

        // Trigger Prism highlighting after adding cards
        setTimeout(() => {
            if (typeof Prism !== 'undefined' && Prism.highlightAllUnder) {
                Prism.highlightAllUnder(promptDisplayArea);
            }
        }, 50);

    } else if (Object.keys(allPromptsData).length === 0 && !promptDisplayArea.querySelector('.text-danger')) {
        promptDisplayArea.innerHTML = '<p>Loading prompts...</p>';
    } else {
        promptDisplayArea.innerHTML = `<p>No prompts found for the '${categoryName}' category.</p>`;
    }

    // Close sidebar on mobile after interaction remains useful
    if (window.innerWidth <= 992 && sidebarOpen) closeSidebar();
}


// --- Modal Functions ---

/**
 * Populates and displays the prompt editing modal.
 * @param {object} promptData - The prompt object ({ title, prompt, language, category }).
 */
function openPromptModal(promptData) {
    if (!modalOverlay || !promptData) {
        console.error("Modal overlay element not found or prompt data missing.");
        return;
    }
    currentModalPrompt = promptData; // Store current prompt data

    // Populate modal fields
    if (modalPromptTitle) modalPromptTitle.textContent = promptData.title || 'Prompt Details';
    if (modalPromptInput) modalPromptInput.value = promptData.prompt || ''; // Pre-fill input with original
    if (modalOriginalPromptText) modalOriginalPromptText.textContent = promptData.prompt || ''; // Display original

    // Show modal
    modalOverlay.classList.add('visible');
    // Optional: Focus the textarea after opening
    // setTimeout(() => modalPromptInput?.focus(), 100);
}

/** Closes the prompt editing modal. */
function closePromptModal() {
    if (modalOverlay) {
        modalOverlay.classList.remove('visible');
    }
    currentModalPrompt = null; // Clear stored prompt data
}


// --- Navigation & Highlighting (No changes needed here) ---
function findPromptCardByTitle(promptTitle) { try { const escapedTitle = CSS.escape(promptTitle); return promptDisplayArea.querySelector(`.prompt-card[data-prompt-title="${escapedTitle}"]`); } catch (e) { console.error("Error finding prompt card with title:", promptTitle, e); return null; } }
function scrollToAndHighlightPrompt(promptTitle) { const targetCard = findPromptCardByTitle(promptTitle); if (targetCard) { document.querySelectorAll('.prompt-card.highlighted').forEach(el => el.classList.remove('highlighted')); targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' }); targetCard.classList.add('highlighted'); setTimeout(() => { if (targetCard && targetCard.classList.contains('highlighted')) { targetCard.classList.remove('highlighted'); } }, 2500); } else { console.warn(`Prompt card with title "${promptTitle}" not found in DOM for highlighting.`); } }

// --- Search Functionality ---
/** Filters prompts and displays predictions */
function handleSearchInput() { /* ... (same as before) ... */ const searchTerm = searchInput.value.trim().toLowerCase(); searchPredictions.innerHTML = ''; if (!searchTerm) { searchPredictions.style.display = 'none'; return; } if (!flatPrompts || flatPrompts.length === 0) { console.warn("Search attempted before flatPrompts list was created."); searchPredictions.style.display = 'none'; return; } const matchingPrompts = flatPrompts.filter(prompt => prompt && typeof prompt.title === 'string' && prompt.title.toLowerCase().includes(searchTerm) ); if (matchingPrompts.length > 0) { matchingPrompts.slice(0, 10).forEach(prompt => { const item = document.createElement('div'); item.className = 'prediction-item'; item.textContent = prompt.title; item.dataset.category = prompt.category; item.dataset.title = prompt.title; item.addEventListener('click', handlePredictionClick); searchPredictions.appendChild(item); }); } else { const noResults = document.createElement('div'); noResults.className = 'no-results'; noResults.textContent = 'No results found'; searchPredictions.appendChild(noResults); } searchPredictions.style.display = 'block'; }

/** Handles clicking on a search prediction - NOW OPENS MODAL */
function handlePredictionClick(event) {
    const targetItem = event.currentTarget;
    const categoryKey = targetItem.dataset.category;
    const promptTitle = targetItem.dataset.title;

    if (categoryKey && promptTitle) {
        // Find the actual prompt data object from the flat list
        const targetPromptData = flatPrompts.find(p => p.category === categoryKey && p.title === promptTitle);

        if (targetPromptData) {
             // 1. Visually activate sidebar item (optional but good UX)
            const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${categoryKey}"]`);
            if (sidebarItem) {
                sidebarListItems.forEach(i => i.classList.remove('active'));
                sidebarItem.classList.add('active');
            }

            // 2. Open the modal directly with the prompt data
            openPromptModal(targetPromptData);

            // 3. Clean up search UI
            searchInput.value = '';
            searchPredictions.style.display = 'none';

             // 4. Close mobile sidebar if open
            if (window.innerWidth <= 992 && sidebarOpen) closeSidebar();

        } else {
             console.error(`Could not find prompt data for "${promptTitle}" in category "${categoryKey}".`);
        }
    } else {
        console.error("Missing category or title data on clicked prediction item:", targetItem);
    }
}

// --- Helper Function for Copying Text ---
/**
 * Copies text to the clipboard and provides visual feedback on an icon.
 * @param {string} textToCopy - The text to copy.
 * @param {HTMLElement} iconElement - The Material Icon span element to update.
 */
async function copyPromptText(textToCopy, iconElement) {
     if (!iconElement) return; // Exit if no icon element provided

     const originalIcon = iconElement.textContent; // Store original icon
     try {
         await navigator.clipboard.writeText(textToCopy);
         iconElement.textContent = 'check'; // Change to check mark
         iconElement.closest('button')?.classList.add('copied'); // Add class to button if exists

         setTimeout(() => {
             iconElement.textContent = originalIcon; // Revert icon
             iconElement.closest('button')?.classList.remove('copied');
         }, 1500); // Revert after 1.5 seconds
     } catch (err) {
         console.error('Failed to copy text: ', err);
         iconElement.textContent = 'error_outline'; // Show error icon
         setTimeout(() => { iconElement.textContent = originalIcon; }, 2000); // Revert after 2 seconds
     }
 }

// --- Data Loading ---
/** Fetches prompt data, processes it, and displays the initial view. */
async function loadPrompts() { if (!dashboardSummaryContainer || !dashboardCardsContainer || !promptContainer) { console.error("Essential layout elements missing."); return; } try { const response = await fetch('prompts.json'); if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}. Failed to fetch 'prompts.json'.`); allPromptsData = await response.json(); console.log("Prompts data loaded successfully."); createFlatPromptList(); calculateCategoryCounts(); displayDashboard(); } catch (error) { console.error("Error loading or processing prompts:", error); dashboardSummaryContainer.style.display = 'grid'; dashboardCardsContainer.style.display = 'grid'; promptContainer.style.display = 'none'; dashboardSummaryContainer.innerHTML = `<p class="text-danger" style="color: var(--danger-color);">Error loading summary.</p>`; dashboardCardsContainer.innerHTML = `<p class="text-danger" style="grid-column: 1 / -1; color: var(--danger-color); padding: 20px; background-color: var(--bg-dark-secondary); border-radius: 5px;"> <strong>Error loading prompts:</strong> ${error.message}.</p>`; } }


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

    // --- Modal Event Listeners ---
    if (modalOverlay) {
        // Close modal on overlay click (but not content click)
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) { // Only close if overlay itself is clicked
                closePromptModal();
            }
        });
    } else { console.error("Modal overlay not found."); }

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closePromptModal);
    } else { console.error("Modal close button not found."); }

    // Close modal on Escape key press
     document.addEventListener('keydown', (event) => {
        if ((event.key === 'Escape' || event.key === 'Esc') && modalOverlay?.classList.contains('visible')) {
             closePromptModal();
        }
     });

     // Modal Reset Button
    if (modalResetBtn && modalPromptInput) {
        modalResetBtn.addEventListener('click', () => {
            if(currentModalPrompt) {
                modalPromptInput.value = currentModalPrompt.prompt || ''; // Reset to original
            } else {
                 modalPromptInput.value = ''; // Fallback if no prompt data
            }
        });
    } else { console.warn("Modal reset button or input textarea not found."); }

    // Modal Search Buttons
    const searchButtons = [
        { button: modalSearchChatGPT, url: "https://chat.openai.com/?q=" },
        { button: modalSearchGemini, url: "https://gemini.google.com/app?q=" },
        { button: modalSearchPerplexity, url: "https://www.perplexity.ai/search?q=" },
    ];

    searchButtons.forEach(({ button, url }) => {
        if (button) {
            button.addEventListener('click', () => {
                // Use the (potentially modified) text from the input, fallback to original
                const searchText = modalPromptInput?.value?.trim() || currentModalPrompt?.prompt || '';
                if (searchText) {
                    const encodedSearch = encodeURIComponent(searchText);
                    window.open(url + encodedSearch, '_blank'); // Open in new tab
                } else {
                    console.warn("No prompt text available in modal to search.");
                    // Maybe provide visual feedback like shaking the input
                }
            });
        } else {
             // Log which button specifically is missing
             const buttonId = searchButtons.find(b => b.button === button)?.button?.id || 'Unknown';
             console.warn(`Modal search button (${buttonId}) not found.`);
        }
    });
}


// --- Initial Application Load ---
document.addEventListener('DOMContentLoaded', () => {
     if (!sidebar || !mainContentTitle || !dashboardSummaryContainer || !dashboardCardsContainer || !promptContainer || !modalOverlay) { // Added modalOverlay check
          console.error("One or more critical layout or modal elements are missing. Aborting script initialization.");
          document.body.innerHTML = "<p style='color: red; padding: 20px;'>Error: Application UI elements missing. Cannot initialize.</p>";
          return;
     }
    setupEventListeners();
    loadPrompts();
});
