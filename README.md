# 💡 LLM Prompt Library - Web UI

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

A professional, responsive web application UI for storing, organizing, searching, and utilizing prompts for Large Language Models (LLMs). Built with HTML, CSS (including CSS Variables for theming), and modern JavaScript.

![App Screenshot](https://github.com/bogdanbarbulescu/prompt/blob/main/LLM-Prompt-Lib.jpg)
*(Replace above line with a link to a screenshot of your application. Consider using a tool like [ScreenToGif](https://www.screentogif.com/) or similar to create an animated GIF showcasing the features!)*

## ✨ Features

*   **Dashboard Overview:** Displays total prompt and category counts, plus quick access cards for each category.
*   **Categorized Prompts:** Organizes prompts into logical categories defined in `prompts.json`.
*   **Dynamic Content Loading:** Fetches prompt data asynchronously from `prompts.json`.
*   **Powerful Search:** Header search bar with live, type-ahead suggestions based on prompt titles.
*   **Syntax Highlighting:** Uses Prism.js for clear visualization of prompt text (especially useful for code-related prompts).
*   **Copy to Clipboard:**
    *   Quick copy button in each prompt card's header.
    *   Integrated copy button within Prism.js code blocks.
*   **Interactive Prompt Modal:**
    *   Click any prompt card to open a detailed modal view.
    *   View and modify the prompt text in a dedicated input area.
    *   See the original prompt for reference.
    *   Reset input to the original prompt text.
    *   Direct search buttons to query the (modified) prompt on ChatGPT and Perplexity.
*   **Responsive Design:** Adapts layout for various screen sizes (desktop, tablet, mobile).
*   **Theme:** Clean, dark theme consistent across all components.
*   **Modern Tech Stack:** Built with vanilla HTML5, CSS3 (with variables), and modern JavaScript (ES6+).

## 🚀 Live Demo

[**View Live Demo**](https://bogdanbarbulescu.github.io/prompt/)


## 🛠️ Technologies Used

*   **HTML5:** Structure and semantics.
*   **CSS3:** Styling, layout (Grid), responsiveness, and theming (CSS Variables).
*   **JavaScript (ES6+):** DOM manipulation, event handling, asynchronous data fetching (`fetch`), search logic, modal functionality.
*   **[Prism.js](https://prismjs.com/):** Lightweight, extensible syntax highlighter.
*   **[Material Icons (Outlined)](https://fonts.google.com/icons?selected=Material+Icons+Outlined):** Icons used throughout the UI.
*   **(No Frameworks):** Built with vanilla technologies for learning and control.

## 🔧 Local Setup

To run this project locally:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/bogdanbarbulescu/prompt.git
    cd prompt
    ```


2.  **Open `index.html`:**
    *   Simply open the `index.html` file directly in your web browser.
    *   **Note:** Due to browser security restrictions (`CORS`) when using the `fetch` API to load `prompts.json`, the prompts might not load if you open the file directly from your local filesystem (`file:///...`).

3.  **Use a Local Server (Recommended for `fetch` to work):**
    *   **If you have Node.js installed:** Run `npx serve` in the project directory and navigate to the provided `http://localhost:....` address.
    *   **If you have Python 3 installed:** Run `python -m http.server` in the project directory and navigate to `http://localhost:8000`.
    *   **Using VS Code:** Install the "Live Server" extension and click "Go Live".

##  kullanım

1.  **Dashboard:** The initial view shows summary statistics and cards for each prompt category. Click a category card to navigate directly.
2.  **Sidebar:** Use the sidebar to navigate between the Dashboard and different prompt categories.
3.  **Category View:** Displays all prompts within the selected category.
    *   Click the copy icon (📄) in a prompt card header for a quick copy.
    *   Click anywhere else on the prompt card to open the detailed modal view.
4.  **Search:** Use the search bar in the header. As you type, relevant prompt titles will appear as predictions. Click a prediction to open that prompt in the modal.
5.  **Modal:**
    *   View the original prompt.
    *   Modify the prompt in the "Customize Prompt" textarea.
    *   Use the "Reset Input" button to revert changes.
    *   Use the "Search on..." buttons to open the *current* text in the textarea in a new tab for the respective AI service.

## ➕ Adding/Modifying Prompts

Prompts are managed centrally in the `prompts.json` file located in the root directory.

1.  **Locate `prompts.json`**.
2.  **Structure:** The file is a JSON object where keys represent categories (`data-category` attribute in HTML) and values are arrays of prompt objects.
3.  **Prompt Object Format:** Each prompt object within a category array should follow this structure:
    ```json
    {
      "title": "Your Concise Prompt Title",
      "prompt": "The actual prompt text, potentially using {placeholders}.",
      "language": "language-name" // e.g., "text", "python", "javascript", "sql", "markdown" - for Prism.js highlighting
    }
    ```
4.  **Add/Edit:** Add new objects to the appropriate category array or modify existing ones. Ensure valid JSON syntax (commas between objects, correct brackets/braces).
5.  **Add Category:** To add a new category:
    *   Add a new key-value pair to `prompts.json` (key = category name, value = array of prompt objects).
    *   Add a corresponding list item (`<li>`) to the `<ul class="sidebar-list">` in `index.html`, making sure the `data-category` attribute matches the JSON key. Choose an appropriate Material Icon.
6.  **Save `prompts.json`**.
7.  **Refresh** the application in your browser (or commit/push if using GitHub Pages).

## 🤝 Contributing

Contributions are welcome! If you have suggestions for improvements, new features, or bug fixes:

1.  Fork the repository.
2.  Create a new branch (`git checkout -b feature/YourFeature` or `bugfix/YourBugFix`).
3.  Make your changes.
4.  Commit your changes (`git commit -m 'Add some amazing feature'`).
5.  Push to the branch (`git push origin feature/YourFeature`).
6.  Open a Pull Request.

Please ensure your code follows the existing style and maintains functionality.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
*(Make sure you have a LICENSE file in your repository, typically containing the standard MIT License text)*

## 🙏 Made by Bogdan Barbulescu
