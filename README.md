# Simple Web Clock & "Beat The Second" Game

A dynamic web application featuring a sleek, space-themed digital clock and an engaging reaction-based mini-game called "Beat The Second". Built with HTML, CSS, and vanilla JavaScript, this project now boasts a dark mode interface, polished animations, and an interactive tutorial for new players.

## Features

-   **Themed Digital Clock:** Displays time in HH:MM:SS format with a modern, dark space aesthetic.
-   **"Beat The Second" Mini-Game:**
    -   Test your reaction time by clicking the target before the second ticks over!
    -   Dynamic target appearance and scoring.
    -   Enhanced visual feedback with polished animations for hits and misses.
-   **Dark Mode Interface:** Stylish and easy on the eyes, inspired by GitHub's dark theme with space elements.
-   **Interactive Tutorial:** A guided walkthrough for first-time users explaining how to play the game.
-   **Lightweight and Fast-Loading:** Built with pure HTML, CSS, and JavaScript.
-   **Easy to Deploy:** Static files ready for any web hosting service (GitHub Pages instructions included).

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
-   **CSS3:** For styling the clock and page layout, including animations and a responsive theme.
-   **JavaScript (ES6+):** For the clock's functionality, game logic, and interactive tutorial.

## Beat The Second - Mini-Game

Integrated into this web clock is a simple and fun reaction-based mini-game called "Beat The Second"!

### How to Play

1.  **Interactive Tutorial:** If it's your first time, an interactive tutorial will guide you through the basics!
2.  **Objective:** Click the colored circle (the target) as quickly as possible after it appears with a "materialize" animation.
3.  **Timing is Key:** You must click the target *before* the main clock display ticks to the next second. The target will appear at a random moment within the current second.
4.  **Scoring & Animations:**
    -   If you click the target in time, it will trigger an "energy burst" animation, and your score increases.
    -   If you click too late or miss, the target will "dematerialize." Your score won't increase for that round.
5.  **Gameplay:** The game runs continuously. A new target will appear with its animation shortly after the start of each new second on the main clock.

The game starts automatically after the tutorial (or immediately if you've completed it before). Good luck!

## Contributing

Contributions are welcome! If you have ideas for improvements or find any issues, please feel free to open an issue or submit a pull request.
