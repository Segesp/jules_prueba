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
const MIN_APPEAR_DELAY_MS = 100; 
const MAX_APPEAR_DELAY_MS = 800; 
const TARGET_VISIBLE_DURATION_MS = 700; 

function showTarget() {
    const randomDelay = Math.random() * (MAX_APPEAR_DELAY_MS - MIN_APPEAR_DELAY_MS) + MIN_APPEAR_DELAY_MS;
    
    if (gameLoopTimeout) {
        clearTimeout(gameLoopTimeout);
    }

    gameLoopTimeout = setTimeout(() => {
        // Reset classes before showing
        target.classList.remove('hit-animation', 'miss-animation', 'hit', 'miss', 'appear');
        // Ensure display is 'block' for animations to work, then add appear for animation
        // Note: .appear class in CSS now handles display:block and the materialize animation
        target.classList.add('appear'); 
        targetAppearTime = new Date().getTime(); 

        // Auto-miss if not clicked
        setTimeout(() => {
            if (target.classList.contains('appear')) { // If still in 'appear' state (not clicked)
                target.classList.remove('appear');
                target.classList.add('miss'); // Optional for semantic state
                target.classList.add('miss-animation');
                target.addEventListener('animationend', function onMissAnimationEnd() {
                    target.removeEventListener('animationend', onMissAnimationEnd); // Clean up
                    scheduleNextTarget();
                }, { once: true });
            }
        }, TARGET_VISIBLE_DURATION_MS);

    }, randomDelay);
}

function scheduleNextTarget() {
    // If game is paused for tutorial, don't schedule next target
    if (gamePausedForTutorial) {
        return;
    }
    const now = new Date();
    const msUntilNextSecond = 1000 - now.getMilliseconds();
    
    if (gameLoopTimeout) {
        clearTimeout(gameLoopTimeout); 
    }

    gameLoopTimeout = setTimeout(() => {
        showTarget();
    }, msUntilNextSecond);
}

target.addEventListener('click', () => {
    // Check if the target is currently accepting clicks (i.e., has 'appear' class)
    if (!target.classList.contains('appear') || !targetAppearTime) {
        return; 
    }

    const clickTime = new Date().getTime();
    const reactionTime = clickTime - targetAppearTime;

    const targetAppearSecond = new Date(targetAppearTime).getSeconds();
    const clickSecond = new Date(clickTime).getSeconds();

    target.classList.remove('appear'); // Remove 'appear' class as it's been interacted with

    if (targetAppearSecond === clickSecond && reactionTime <= TARGET_VISIBLE_DURATION_MS) {
        score++;
        scoreDisplay.textContent = score;
        target.classList.add('hit'); // Optional: for semantic state
        target.classList.add('hit-animation');
        target.addEventListener('animationend', function onHitAnimationEnd() {
            target.removeEventListener('animationend', onHitAnimationEnd); // Clean up
            scheduleNextTarget();
        }, { once: true });
    } else {
        target.classList.add('miss'); // Optional: for semantic state
        target.classList.add('miss-animation');
        target.addEventListener('animationend', function onMissAnimationEnd() {
            target.removeEventListener('animationend', onMissAnimationEnd); // Clean up
            scheduleNextTarget();
        }, { once: true });
    }
    
    targetAppearTime = null; 
});

// --- Interactive Tutorial Logic ---
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialContent = document.getElementById('tutorial-content');
const tutorialNextBtn = document.getElementById('tutorial-next-btn');
const tutorialCloseBtn = document.getElementById('tutorial-close-btn');
const tutorialSteps = Array.from(tutorialContent.querySelectorAll('p[data-step]'));

let currentTutorialStep = 1;
const TOTAL_TUTORIAL_STEPS = 6; // As defined in HTML
let gamePausedForTutorial = false;

// Elements to highlight during tutorial
const clockElement = document.getElementById('clock');
const scoreDisplayElement = document.getElementById('score-display');
const gameAreaElement = document.getElementById('game-area');
// const targetElementForTutorial = document.getElementById('target'); // Re-using 'target' id if needed for static display

function showTutorialStep(stepNumber) {
    tutorialSteps.forEach(p => {
        if (parseInt(p.dataset.step) === stepNumber) {
            p.classList.remove('hidden');
            p.classList.add('active-step'); 
        } else {
            p.classList.add('hidden');
            p.classList.remove('active-step');
        }
    });

    removeHighlights();
    switch (stepNumber) {
        case 2: 
            clockElement.classList.add('highlight-tutorial');
            break;
        case 3: 
            scoreDisplayElement.classList.add('highlight-tutorial');
            break;
        case 4: 
            gameAreaElement.classList.add('highlight-tutorial');
            // Example: Show a static target (ensure it's styled appropriately if used)
            // target.style.opacity = '1'; target.style.transform = 'scale(1)'; target.style.display = 'block';
            // target.classList.remove('appear', 'hit-animation', 'miss-animation');
            break;
        case 5: // "Ready?" step
            // No specific highlight, or highlight game area again.
            gameAreaElement.classList.add('highlight-tutorial');
            break;
    }
    
    if (stepNumber === TOTAL_TUTORIAL_STEPS) { 
        tutorialNextBtn.classList.add('hidden');
        tutorialCloseBtn.classList.remove('hidden');
    } else {
        tutorialNextBtn.classList.remove('hidden');
        tutorialCloseBtn.classList.add('hidden');
    }
}

function removeHighlights() {
    clockElement.classList.remove('highlight-tutorial');
    scoreDisplayElement.classList.remove('highlight-tutorial');
    gameAreaElement.classList.remove('highlight-tutorial');
    // If static target was shown:
    // target.style.display = 'none'; target.style.opacity = '0'; target.style.transform = 'scale(0.5)';
}

function startTutorial() {
    gamePausedForTutorial = true; // Pause game logic
    if (typeof gameLoopTimeout !== 'undefined' && gameLoopTimeout) {
         clearTimeout(gameLoopTimeout); 
         if (target.classList.contains('appear')) { // Hide active game target if present
            target.classList.remove('appear');
            // Reset its animation state if needed, or ensure it's hidden by opacity/display
            target.style.opacity = '0'; 
            target.style.transform = 'scale(0.5)';
         }
    }

    tutorialOverlay.classList.remove('hidden');
    currentTutorialStep = 1;
    showTutorialStep(currentTutorialStep);
}

function nextTutorialStep() {
    currentTutorialStep++;
    if (currentTutorialStep <= TOTAL_TUTORIAL_STEPS) {
        showTutorialStep(currentTutorialStep);
    }
}

function closeTutorial() {
    tutorialOverlay.classList.add('hidden');
    removeHighlights();
    localStorage.setItem('tutorialCompleted', 'true');
    
    gamePausedForTutorial = false; // Unpause
    if (typeof scheduleNextTarget === 'function') {
        scheduleNextTarget(); // Start/Resume the game loop
    }
}

tutorialNextBtn.addEventListener('click', nextTutorialStep);
tutorialCloseBtn.addEventListener('click', closeTutorial);

document.addEventListener('DOMContentLoaded', () => {
    // Ensure all elements are available before trying to interact
    if (!tutorialOverlay || !tutorialContent || !tutorialNextBtn || !tutorialCloseBtn || !clockElement || !scoreDisplayElement || !gameAreaElement || !target) {
        console.error("Tutorial or game elements not found on DOMContentLoaded. Tutorial might not work correctly.");
        // Fallback: try to start game anyway if tutorial elements missing
        if (typeof scheduleNextTarget === 'function') {
             scheduleNextTarget();
        }
        return;
    }

    if (localStorage.getItem('tutorialCompleted') !== 'true') {
        startTutorial();
    } else {
        // If tutorial already completed, ensure overlay is hidden and start game
        tutorialOverlay.classList.add('hidden'); 
        gamePausedForTutorial = false; // Ensure game is not paused
        if (typeof scheduleNextTarget === 'function') {
            scheduleNextTarget(); 
        }
    }
});
