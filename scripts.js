// --- Sidebar Toggle Logic ---
let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    // For the improved media query transition:
    // We might need a slight delay for the transition class to register
    // or directly manipulate the left property if using fixed positioning.
    // Let's try adding an 'open' class for clarity with the CSS transition.
    // Remove the inline style if it exists from closing.
    sidebar.style.left = '';
    sidebar.classList.add('open');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('open');
    // Optionally use the inline style method for fixed positioning:
    // sidebar.style.left = '-260px';
    // Or rely purely on the class removal with CSS transition.
    // For consistency with the original provided CSS using 'sidebar-responsive':
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

// --- Global variables ---
let allPromptsData = {}; // To store fetched prompts { categoryKey: [promptObjects] }
let categoryCounts = []; // To store { key, name, icon, count } for dashboard cards

// --- DOM Elements ---
const promptDisplayArea = document.getElementById('prompt-display-area');
const sidebarListItems = document.querySelectorAll('.sidebar-list-item');
const mainContentTitle = document.getElementById('main-content-title');
const dashboardCardsContainer = document.getElementById('dashboard-cards');
const promptContainer = document.getElementById('prompt-container');

// --- Functions ---

/**
 * Calculates the number of prompts per category based on loaded data
 * and sidebar item information. Populates the global categoryCounts array.
 */
function calculateCategoryCounts() {
    categoryCounts = []; // Reset before recalculating
    const categoriesInData = Object.keys(allPromptsData);

    sidebarListItems.forEach(item => {
        const categoryKey = item.getAttribute('data-category');

        // Skip the dashboard item itself in the counts
        if (!categoryKey || categoryKey === 'dashboard') return;

        const link = item.querySelector('a');
        const iconElement = link?.querySelector('.material-icons-outlined');
        // Extract category name robustly from link text
        const categoryName = link?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey;
        const iconName = iconElement?.textContent.trim() || 'category'; // Default icon

        // Get count from the loaded data, default to 0 if category not in data or has no prompts
        const count = allPromptsData[categoryKey]?.length || 0;

        // Store the collected info
        categoryCounts.push({
            key: categoryKey,
            name: categoryName,
            icon: iconName,
            count: count
        });
    });
    // console.log("Calculated Category Counts:", categoryCounts); // For debugging
}


/**
 * Displays the Dashboard view with cards summarizing each category.
 */
function displayDashboard() {
    mainContentTitle.textContent = "Dashboard"; // Set the main title
    promptContainer.style.display = 'none'; // Hide the prompt display area
    dashboardCardsContainer.innerHTML = ''; // Clear any existing dashboard cards
    dashboardCardsContainer.style.display = 'grid'; // Ensure the dashboard grid is visible

    // Check if category counts are available
    if (categoryCounts.length === 0) {
        // Display a loading message or handle the case where counts aren't ready
        // This might happen if displayDashboard is called before loadPrompts finishes calculation
        dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Loading category information...</p>";
        return;
    }

    // Create a card for each category
    categoryCounts.forEach(cat => {
        // Create card element
        const card = document.createElement('div');
        card.className = 'card category-card'; // Use defined styles
        card.setAttribute('data-category-key', cat.key); // Store key for click navigation

        // Card inner container (for title and icon)
        const cardInner = document.createElement('div');
        cardInner.className = 'card-inner';

        const title = document.createElement('h3');
        title.textContent = cat.name; // Category name

        const iconSpan = document.createElement('span');
        iconSpan.className = 'material-icons-outlined';
        iconSpan.textContent = cat.icon; // Category icon

        cardInner.appendChild(title);
        cardInner.appendChild(iconSpan);

        // Card count display
        const countH1 = document.createElement('h1');
        countH1.textContent = cat.count; // Number of prompts

        // Append inner elements to the card
        card.appendChild(cardInner);
        card.appendChild(countH1);

        // Add click listener to the card to navigate to the category view
        card.addEventListener('click', () => {
             // Find the corresponding sidebar item using the stored key
             const sidebarItem = document.querySelector(`.sidebar-list-item[data-category="${cat.key}"]`);
             if (sidebarItem) {
                 sidebarItem.click(); // Simulate a click on the sidebar item
             } else {
                 console.warn(`Sidebar item for category key "${cat.key}" not found.`);
             }
        });

        // Add the completed card to the dashboard container
        dashboardCardsContainer.appendChild(card);
    });
}


/**
 * Displays the prompts for a specific category.
 * @param {string} categoryKey - The key of the category to display (e.g., 'general', 'coding').
 */
function displayPrompts(categoryKey) {
    // Find the corresponding sidebar item to get the display name
    const categoryElement = document.querySelector(`.sidebar-list-item[data-category="${categoryKey}"] a`);
    // Extract name robustly, fallback to capitalized key
    const iconElement = categoryElement?.querySelector('.material-icons-outlined');
    const categoryName = categoryElement?.textContent.replace(iconElement?.textContent || '', '').trim() || categoryKey.charAt(0).toUpperCase() + categoryKey.slice(1);

    mainContentTitle.textContent = `${categoryName} Prompts`; // Update the main title

    // Toggle visibility: Hide dashboard, show prompts area
    dashboardCardsContainer.style.display = 'none';
    promptContainer.style.display = 'block';
    promptDisplayArea.innerHTML = ''; // Clear previous prompts

    // Get the prompts for the selected category from the global data
    const prompts = allPromptsData[categoryKey];

    if (prompts && prompts.length > 0) {
        // If prompts exist, create and display a card for each
        prompts.forEach(p => {
            const card = document.createElement('div');
            card.className = 'prompt-card'; // Style for individual prompt cards

            const cardHeader = document.createElement('div');
            cardHeader.className = 'prompt-card-header';

            const title = document.createElement('h5');
            title.className = 'prompt-card-title';
            title.textContent = p.title; // Prompt title

            cardHeader.appendChild(title);
            card.appendChild(cardHeader);

            // Container needed for Prism Toolbar plugin (Copy button)
            const codeContainer = document.createElement('div');
            codeContainer.className = 'code-toolbar';

            const pre = document.createElement('pre');
            const code = document.createElement('code');
            // Set the language class for PrismJS syntax highlighting
            code.className = `language-${p.language || 'text'}`; // Default to 'text' if no language specified
            code.textContent = p.prompt; // The actual prompt text

            pre.appendChild(code);
            codeContainer.appendChild(pre);
            card.appendChild(codeContainer);
            promptDisplayArea.appendChild(card);
        });

        // After adding all prompt cards to the DOM, trigger PrismJS highlighting
        // Use setTimeout to ensure the DOM is fully updated before Prism runs
        setTimeout(() => {
            Prism.highlightAllUnder(promptDisplayArea); // Highlight only within the prompt area
        }, 0);

    } else if (Object.keys(allPromptsData).length === 0 && !promptDisplayArea.querySelector('.text-danger')) {
        // Handle case where data might still be loading (or failed silently)
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


/**
 * Fetches prompt data from the JSON file, calculates counts,
 * and displays the initial Dashboard view.
 */
async function loadPrompts() {
  try {
    // Fetch the JSON data file
    const response = await fetch('prompts.json'); // Assumes prompts.json is in the root directory
    if (!response.ok) {
        // Handle HTTP errors (like 404 Not Found)
        throw new Error(`HTTP error! Status: ${response.status}. Failed to fetch 'prompts.json'.`);
    }
    // Parse the JSON response
    allPromptsData = await response.json();
    console.log("Prompts data loaded successfully.");

    // Data is loaded, now calculate the counts for the dashboard
    calculateCategoryCounts();

    // Display the initial view (Dashboard) now that data and counts are ready
    displayDashboard();

  } catch (error) {
    // Handle errors during fetch or JSON parsing
    console.error("Error loading or processing prompts:", error);
    // Display a user-friendly error message in the main content area
    dashboardCardsContainer.style.display = 'grid'; // Ensure grid layout for the message
    promptContainer.style.display = 'none'; // Hide prompt area
    // Add error message spanning across grid columns
    dashboardCardsContainer.innerHTML = `<p class="text-danger" style="grid-column: 1 / -1; color: #ff6d00; padding: 20px;">Error loading prompts: ${error.message}. Please check if 'prompts.json' exists and is valid.</p>`;
  }
}


// --- Event Listeners ---

// Add click listener to each sidebar list item
sidebarListItems.forEach(item => {
  item.addEventListener('click', (event) => {
    event.preventDefault(); // Stop default link behavior

    // Visually update active state in sidebar
    sidebarListItems.forEach(i => i.classList.remove('active'));
    item.classList.add('active');

    // Get the category key associated with the clicked item
    const category = item.getAttribute('data-category');

    // Decide which view to display based on the category key
    if (category === 'dashboard') {
        // Show the dashboard view
        // Check if counts are ready before displaying
        if(categoryCounts.length > 0 || Object.keys(allPromptsData).length > 0) { // Check if data loaded even if counts somehow failed
             displayDashboard();
        } else {
            // Data/counts might still be loading, show placeholder
            console.warn("Dashboard clicked before category counts were ready.");
            dashboardCardsContainer.style.display = 'grid';
            promptContainer.style.display = 'none';
            dashboardCardsContainer.innerHTML = "<p style='grid-column: 1 / -1;'>Calculating category info...</p>";
        }
    } else if (category) {
        // Show the prompt list view for the selected category
        // Check if data is loaded before attempting to display prompts
        if (Object.keys(allPromptsData).length > 0) {
            displayPrompts(category);
        } else {
             // Data might still be loading
             console.warn("Prompt category clicked before data loaded.");
             promptContainer.style.display = 'block'; // Show prompt container
             dashboardCardsContainer.style.display = 'none'; // Hide dashboard
             promptDisplayArea.innerHTML = '<p>Loading prompts, please wait...</p>'; // Show loading message
        }
    } else {
        console.warn("Clicked sidebar item has no 'data-category' attribute.");
    }

    // Close sidebar automatically on smaller screens after interaction
    if (window.innerWidth <= 992 && sidebarOpen) {
        closeSidebar();
    }

  });
});

// Add listener to the document to close the sidebar when clicking outside of it
document.addEventListener('click', function(event) {
  // Check if the sidebar is currently open
  if (!sidebarOpen) return;

  // Check if the click target is the menu icon or inside the menu icon
  const isMenuIcon = event.target.classList.contains('menu-icon') || event.target.closest('.menu-icon');

  // Check if the click target is inside the sidebar itself
  const isInsideSidebar = sidebar.contains(event.target);

  // If the click is NOT the menu icon and NOT inside the sidebar, close it
  if (!isMenuIcon && !isInsideSidebar) {
    closeSidebar();
  }
});


// --- Initial Application Load ---
// Start the process by fetching the prompt data.
// loadPrompts() will handle the subsequent steps (calculating counts, displaying dashboard).
loadPrompts();
