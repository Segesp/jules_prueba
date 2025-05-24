# Minimalist Puzzle Clock

A challenging puzzle game requiring spatial thinking and synchronization. The objective is to align all hands on double-sided clock boards to the 12 o'clock position using a set of levers that affect hands on both faces simultaneously.

The game features a clean, minimalist design to help you focus on the puzzle.

## Features

-   **Real-Time Clock Display:** Shows the current actual time (persists from previous application version).
-   **Minimalist Puzzle Clock Game (Version 1 - Level 1):**
    -   **Objective:** Align all 12 hands on both the front and back clock faces to the 12 o'clock position.
    -   **Double-Sided Clock Boards:** Interact with two clock faces simultaneously.
    -   **Interconnected Controls (Levers):** Four levers are available. Each lever affects a specific set of hands on the front clock face (typically moving them clockwise) and a corresponding set of hands on the back clock face (typically moving them counter-clockwise).
    -   **Intermediate Mechanic - Pin Blocker:** "Lever 4" toggles a "Pin Blocker" (Pin F-A). When active, this pin blocks the movement of certain hands on the front clock face, adding a strategic layer to the puzzle.
    -   **Visual Feedback:** Smooth hand animations and clear feedback on lever activation and win state.
    -   **Reset Functionality:** Allows resetting the current level to its initial state.
-   **Responsive Design:** Adapts to various screen sizes for a consistent experience on desktop, tablet, and mobile devices.
-   **Accessibility Considerations:**
    -   Keyboard navigation for controls.
    -   Clear visual focus indicators.
    -   Option to reduce/disable animations (persists from previous application version, though current puzzle game has fewer complex animations).

## How to Play "Minimalist Puzzle Clock"

1.  **Objective:** The goal is to set all 12 hands on *both* the front clock face and the back clock face to point to the 12 o'clock position.
2.  **Controls:**
    -   Use **Lever 1, Lever 2, and Lever 3** to move specific groups of hands. Each of these levers moves a set of hands on the front clock clockwise and the corresponding hands on the back clock counter-clockwise.
    -   **Lever 4** toggles the state of "Pin F-A" (Active/Inactive).
3.  **Pin Blocker (Pin F-A):**
    -   When Pin F-A is **Active**, it prevents Levers 1, 2, or 3 from moving the first three hands (1, 2, 3 o'clock positions) on the **front** clock face. It does not affect the back clock hands directly.
    -   Use Lever 4 strategically to activate or deactivate the pin to enable the required moves.
4.  **Solving:** Experiment with the levers to understand their effects. Plan your moves carefully, considering how each action impacts both clock faces and how the pin state might help or hinder your progress.
5.  **Winning:** The level is complete when all 24 hands (12 on front, 12 on back) point to 12. A "Level Complete!" message will appear.
6.  **Reset:** Use the "Reset Level" button at any time to start the current level over.

## Running Locally

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
-   **CSS3:** For styling, layout (including Flexbox for responsive design), and basic animations/transitions.
-   **JavaScript (ES6+):** For all game logic, DOM manipulation, event handling, and dynamic clock hand rendering.

## Contributing
Contributions are welcome! If you have ideas for improvements or find any issues, please feel free to open an issue or submit a pull request.
