# Simple Web Clock

A clean and simple web application that displays the current time, updating every second. Built with HTML, CSS, and vanilla JavaScript.

## Features

- Displays time in HH:MM:SS format.
- Updates dynamically every second.
- Simple, clean user interface.
- Lightweight and fast-loading.

## Running Locally

To run this application locally:

1.  Clone this repository or download the source files (`index.html`, `style.css`, `script.js`).
2.  Navigate to the directory where you saved the files.
3.  Open the `index.html` file in your preferred web browser.

No special build steps or dependencies are required.

## Deployment

This web application consists of static files and can be deployed to any static web hosting service.

### GitHub Pages

GitHub Pages is a great way to host this project for free directly from your GitHub repository.

1.  **Ensure your code is in a GitHub repository.** If you cloned this project or created your own, make sure it's pushed to a repository on GitHub.
2.  **Navigate to Repository Settings:** In your GitHub repository, click on the "Settings" tab.
3.  **Go to Pages:** In the left sidebar, click on "Pages" under the "Code and automation" section.
4.  **Configure Source:**
    *   Under "Build and deployment", for "Source", select "Deploy from a branch".
    *   For "Branch", select your main branch (commonly `main` or `master`).
    *   For the folder, select `/ (root)`.
5.  **Save:** Click "Save".
6.  **Wait for Publishing:** GitHub Actions will start a deployment process. After a few minutes, your site will be published at `https://<your-username>.github.io/<your-repository-name>/`. You'll see the URL on the Pages settings screen once it's live.

### Other Services

Other popular options for static hosting include:

-   Netlify
-   Vercel
-   AWS S3
-   Google Cloud Storage

For these services, you would typically upload the `index.html`, `style.css`, and `script.js` files to your chosen hosting provider. Refer to their specific documentation for detailed steps.

## Technologies Used

-   **HTML5:** For the basic structure of the web page.
-   **CSS3:** For styling the clock and page layout.
-   **JavaScript (ES6+):** For the clock's functionality, updating the time dynamically.

## Beat The Second - Mini-Game

Integrated into this web clock is a simple and fun reaction-based mini-game called "Beat The Second"!

### How to Play

1.  **Objective:** Click the colored circle (the target) as quickly as possible after it appears.
2.  **Timing is Key:** You must click the target *before* the main clock display ticks to the next second. The target will appear at a random moment within the current second.
3.  **Scoring:**
    *   If you click the target in time (within the same second it appeared), your score increases. The target will flash green.
    *   If you click too late (after the clock's second has changed) or miss the target entirely, it will flash red, and your score will not increase for that round.
4.  **Gameplay:** The game runs continuously. A new target will appear in the game area shortly after the start of each new second on the main clock.
5.  **Instructions on Page:** Look for the instruction "Click the circle before the second ticks over on the clock!" above the game area on the webpage.

The game starts automatically when the page loads. Good luck!

## Contributing

Contributions are welcome! If you have ideas for improvements or find any issues, please feel free to open an issue or submit a pull request.
