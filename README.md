# Simple Web Clock & "Beat The Second" Game

A dynamic web application featuring a sleek, space-themed digital clock and an engaging reaction-based mini-game called "Beat The Second". Built with HTML, CSS, and vanilla JavaScript, this project now boasts a dark mode interface, polished animations, an interactive tutorial, diverse target types, and a progressively challenging game loop.

## Features

-   **Themed Digital Clock:** Displays time in HH:MM:SS format with a modern, dark space aesthetic.
-   **"Beat The Second" Mini-Game:**
    -   Test your reaction time by clicking the target before the second ticks over!
    -   **Multiple Target Types:**
        -   **Standard:** Basic point scoring.
        -   **Bonus:** Awards extra points.
        -   **Avoid:** Incurs a penalty if clicked.
        -   **Quick-Fade:** Shorter visibility for a speed challenge.
    -   **Dynamic Target Behaviors:**
        -   **Moving Targets:** Drift within the game area.
        -   **Multi-Click Targets:** Require several clicks to capture, with feedback on each click and changing visual cues for remaining clicks.
        -   **Shrinking/Growing Targets:** Target size changes dynamically after appearing.
    -   **Progressive Difficulty:** Game subtly becomes more challenging as your score increases, introducing more complex targets more frequently.
    -   **Enhanced Animations:** Refined appear, hit, and miss animations for targets, plus subtle score update feedback. Animations are designed to be smooth and respect the "Reduce Animations" accessibility setting.
    -   **Performance Optimized:** Main game loop uses `requestAnimationFrame` for efficient timing and smoother visuals.
-   **Dark Mode Interface:** Stylish and easy on the eyes, inspired by GitHub's dark theme with space elements.
-   **Interactive Tutorial:** A guided walkthrough for first-time users explaining how to play the game.
-   **Responsive Design:** Adapts to various screen sizes for a consistent experience on desktop, tablet, and mobile devices.
-   **Accessibility Enhancements:**
    -   Full keyboard navigation for all interactive elements.
    -   Clear visual focus indicators.
    -   Game target operable via keyboard (Enter/Space).
    -   ARIA role (`role="button"`) for the game target to improve screen reader understanding.
    -   Option to reduce or disable animations for users sensitive to motion.
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
(Instructions for GitHub Pages remain the same)
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
-   **CSS3:** For styling the clock and page layout, including a responsive theme and advanced animations (`@keyframes`, transitions).
-   **JavaScript (ES6+):** For the clock's functionality, all game logic (including the `requestAnimationFrame` based game loop), interactive tutorial, and dynamic target behaviors.

## Beat The Second - Mini-Game

Integrated into this web clock is a simple and fun reaction-based mini-game called "Beat The Second"!

### How to Play

1.  **Interactive Tutorial:** If it's your first time, an interactive tutorial will guide you through the basics!
2.  **Objective:** Click the colored circle (the target) as quickly as possible after it appears.
3.  **Target Variations:** Be prepared for different types of targets!
    -   Some are standard, some give **bonus** points.
    -   Watch out for **avoid** targets (don't click them!).
    -   Some targets might be **quick-fading**, **move around**, require **multiple clicks**, or even **change size**!
4.  **Timing is Key:** You must click the target *before* the main clock display ticks to the next second.
5.  **Scoring & Animations:** Successful hits on positive targets increase your score with an "energy burst" animation. Penalties apply for misclicked "avoid" targets. Missed targets will "dematerialize."

The game starts automatically after the tutorial (or immediately if you've completed it before). Good luck!

## Contributing

Contributions are welcome! If you have ideas for improvements or find any issues, please feel free to open an issue or submit a pull request.
