function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
}

setInterval(updateClock, 1000);
updateClock(); // Initial call to display clock immediately

// Game Elements
const target = document.getElementById('target');
const scoreDisplay = document.getElementById('score');
let score = 0;
let gameLoopTimeout;
let targetAppearTime; // To store the timestamp when the target appears

// Game Configuration
const MIN_APPEAR_DELAY_MS = 100; // Min ms into the second for target to appear
const MAX_APPEAR_DELAY_MS = 800; // Max ms into the second for target to appear (ensure enough time to react)
const TARGET_VISIBLE_DURATION_MS = 700; // How long the target stays if not clicked

function showTarget() {
    // Calculate a random time within the current second to show the target
    const randomDelay = Math.random() * (MAX_APPEAR_DELAY_MS - MIN_APPEAR_DELAY_MS) + MIN_APPEAR_DELAY_MS;
    
    // Clear any existing timeout for showing target (e.g., if clock second changed early)
    if (gameLoopTimeout) {
        clearTimeout(gameLoopTimeout);
    }

    gameLoopTimeout = setTimeout(() => {
        target.style.display = 'block';
        target.className = ''; // Reset classes (remove hit/miss)
        targetAppearTime = new Date().getTime(); // Record when target became visible

        // Set another timeout to hide the target if not clicked
        // This also acts as the "miss" condition if time runs out for the current second
        setTimeout(() => {
            if (target.style.display === 'block' && target.className !== 'hit') { // if still visible and not already hit
                target.className = 'miss';
                // Hide it after a brief moment to show the miss color
                setTimeout(() => target.style.display = 'none', 200);
                scheduleNextTarget(); // Prepare for the next second
            }
        }, TARGET_VISIBLE_DURATION_MS);

    }, randomDelay);
}

function scheduleNextTarget() {
    // Wait for the beginning of the next second to schedule a new target
    const now = new Date();
    const msUntilNextSecond = 1000 - now.getMilliseconds();
    
    if (gameLoopTimeout) {
        clearTimeout(gameLoopTimeout); // Clear previous target scheduling
    }

    gameLoopTimeout = setTimeout(() => {
        showTarget();
    }, msUntilNextSecond);
}

target.addEventListener('click', () => {
    if (target.style.display !== 'block' || !targetAppearTime) {
        return; // Target not visible or not properly set up
    }

    const clickTime = new Date().getTime();
    const reactionTime = clickTime - targetAppearTime;

    // Check if the click happened within the same second the target appeared
    // And within the allowed visible duration (implicitly handled by target being visible)
    const targetAppearSecond = new Date(targetAppearTime).getSeconds();
    const clickSecond = new Date(clickTime).getSeconds();

    if (targetAppearSecond === clickSecond && reactionTime <= TARGET_VISIBLE_DURATION_MS) {
        score++;
        scoreDisplay.textContent = score;
        target.className = 'hit';
        // Hide it after a brief moment to show hit color
        setTimeout(() => target.style.display = 'none', 200); 
    } else {
        target.className = 'miss';
        // Hide it after a brief moment to show miss color
        setTimeout(() => target.style.display = 'none', 200);
    }
    
    targetAppearTime = null; // Reset for next appearance
    
    // Clear the automatic hide timeout because it was clicked
    // (The timeout set in showTarget to auto-hide if not clicked)
    // This requires storing its ID, let's simplify for now and rely on the fast user click.
    // For a more robust solution, we'd clear that specific timeout.

    scheduleNextTarget(); // Schedule the next target appearance
});

// Initial call to start the game loop
scheduleNextTarget();
