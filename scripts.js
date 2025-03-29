// --- Sidebar Toggle Logic ---
let sidebarOpen = false;
const sidebar = document.getElementById('sidebar');
const mainContainer = document.querySelector('.main-container'); // Get main container

function openSidebar() {
  if (!sidebarOpen) {
    sidebar.classList.add('sidebar-responsive');
    sidebarOpen = true;
  }
}

function closeSidebar() {
  if (sidebarOpen) {
    sidebar.classList.remove('sidebar-responsive');
    sidebarOpen = false;
  }
}

// --- Global variable to store fetched prompts ---
let allPromptsData = {};

// --- DOM Elements ---
const promptDisplayArea = document.getElementById('prompt-display-area');
const sidebarListItems = document.querySelectorAll('.sidebar-list-item');
const currentCategoryTitle = document.getElementById('current-category-title');

// --- Functions ---

// Function to fetch prompt data from JSON
async function loadPrompts() {
  try {
    // Assuming prompts.json is in the same directory as index.html
    // If it's in /data/prompts.json, change the path here.
    const response = await fetch('prompts.json');
    if (!response.ok) {
        // More specific error for GitHub Pages context
        throw new Error(`HTTP error! Status: ${response.status}. Check if 'prompts.json' exists and the path is correct.`);
    }
    allPromptsData = await response.json();
    console.log("Prompts loaded successfully.");

    // After loading, display the initial category
    const initialCategory = document.querySelector('.sidebar-list-item.active')?.getAttribute('data-category') || 'general';
    displayPrompts(initialCategory); // Now display prompts

  } catch (error) {
    console.error("Could not load prompts:", error);
    promptDisplayArea.innerHTML = `<p class="text-danger">Error loading prompts: ${error.message}. Please ensure 'prompts.json' is in the repository and the web app is served correctly.</p>`;
  }
}


// Function to display prompts for a given category
function displayPrompts(category) {
  // Update Title using text content from the sidebar link for better accuracy
  const categoryElement = document.querySelector(`.sidebar-list-item[data-category="${category}"] a`);
  // Fallback if element not found (shouldn't happen with current setup)
  const categoryName = categoryElement ? categoryElement.textContent.trim() : category.charAt(0).toUpperCase() + category.slice(1);
  currentCategoryTitle.textContent = `${categoryName} Prompts`;

  // Clear previous prompts
  promptDisplayArea.innerHTML = '';

  // Use the globally loaded data
  const prompts = allPromptsData[category];

  if (prompts && prompts.length > 0) {
    prompts.forEach(p => {
      const card = document.createElement('div');
      card.className = 'prompt-card'; // Your custom card class

      const cardHeader = document.createElement('div');
      cardHeader.className = 'prompt-card-header'; // Custom header class

      const title = document.createElement('h5');
      title.className = 'prompt-card-title'; // Custom title class
      title.textContent = p.title;

      // Add header elements
      cardHeader.appendChild(title);
      card.appendChild(cardHeader);

       // Create container for pre/code needed for Prism toolbar
      const codeContainer = document.createElement('div');
      // Crucial: Add the 'code-toolbar' class for Prism plugin hook
      codeContainer.className = 'code-toolbar';

      const pre = document.createElement('pre');
      // Add line-numbers class optionally via Prism plugin if desired
      // pre.className = 'line-numbers';

      const code = document.createElement('code');
      // Ensure language class is present for Prism
      code.className = `language-${p.language || 'text'}`;
      code.textContent = p.prompt;

      pre.appendChild(code);
      codeContainer.appendChild(pre); // Add pre to the container
      card.appendChild(codeContainer); // Add container to the card
      promptDisplayArea.appendChild(card);
    });

    // IMPORTANT: Re-run Prism highlighting after adding new content dynamically
    // Use setTimeout to ensure DOM is updated before highlighting
    setTimeout(() => {
        // Target the specific area to avoid re-highlighting the whole page if not needed
        Prism.highlightAllUnder(promptDisplayArea);
    }, 0);

  } else if (Object.keys(allPromptsData).length === 0 && !promptDisplayArea.querySelector('.text-danger')) {
      // Data hasn't loaded yet, and no error message is displayed
       promptDisplayArea.innerHTML = '<p>Loading prompts...</p>';
       // Error message is handled in loadPrompts()
  }
   else {
       // Data loaded, but this specific category is empty or doesn't exist
       promptDisplayArea.innerHTML = `<p>No prompts found for the '${categoryName}' category.</p>`;
  }

   // Close sidebar on mobile after clicking an item
   if (window.innerWidth <= 992 && sidebarOpen) {
        closeSidebar();
   }
}

// --- Event Listeners ---

// Sidebar category click listener
sidebarListItems.forEach(item => {
  item.addEventListener('click', (event) => {
    event.preventDefault(); // Prevent default link behavior

    // Remove active class from all items
    sidebarListItems.forEach(i => i.classList.remove('active'));

    // Add active class to the clicked item
    item.classList.add('active');

    const category = item.getAttribute('data-category');
    if (category) {
      // Check if data is loaded before attempting to display
       if (Object.keys(allPromptsData).length > 0) {
            displayPrompts(category);
       } else {
            // Optional: Update UI if data is still loading
            // console.log("Data not ready yet, waiting for loadPrompts...");
            // promptDisplayArea.innerHTML = '<p>Loading prompts, please wait...</p>';
       }
    }
  });
});

// Listener to close sidebar if clicking outside of it on mobile/tablet
document.addEventListener('click', function(event) {
  // Check if the sidebar is open AND the click was outside the sidebar AND not on the menu icon
  const isMenuIcon = event.target.classList.contains('menu-icon') || event.target.closest('.menu-icon');
  if (sidebarOpen && !sidebar.contains(event.target) && !isMenuIcon) {
    closeSidebar();
  }
});


// --- Initial Load ---
// Start loading the prompts as soon as the script runs
loadPrompts();