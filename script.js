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
        target.classList.add('appear'); 
        targetAppearTime = new Date().getTime(); 

        // Auto-miss if not clicked
        setTimeout(() => {
            if (target.classList.contains('appear')) { 
                target.classList.remove('appear');
                target.classList.add('miss'); 
                target.classList.add('miss-animation');
                target.addEventListener('animationend', function onMissAnimationEnd() {
                    target.removeEventListener('animationend', onMissAnimationEnd); 
                    if (!gamePausedForTutorial) scheduleNextTarget();
                }, { once: true });
            }
        }, TARGET_VISIBLE_DURATION_MS);

    }, randomDelay);
}

function scheduleNextTarget() {
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

// Function to handle target activation (to avoid code duplication)
function activateTarget() {
    if (target.style.display !== 'block' && !target.classList.contains('appear')) { // Check if target is visually present
        return; // Target not visible or not properly set up
    }
    if (!targetAppearTime && !target.classList.contains('appear')) { // Additional check for targetAppearTime for robustness
        // This condition might be redundant if the 'appear' class check is solid
        return;
    }

    const clickTime = new Date().getTime(); // Use current time for reaction
    let reactionTime = 0;
    if (targetAppearTime) { // Ensure targetAppearTime was set
        reactionTime = clickTime - targetAppearTime;
    }

    // Check if the click happened within the same second the target appeared
    const targetAppearDate = targetAppearTime ? new Date(targetAppearTime) : null;
    const targetAppearSecond = targetAppearDate ? targetAppearDate.getSeconds() : -1; // Default to -1 if no appear time
    
    const clickDate = new Date(clickTime);
    const clickSecond = clickDate.getSeconds();

    // Clear .appear class and any active animation timeouts from showTarget
    target.classList.remove('appear');
    // If a timeout was set in showTarget to auto-miss, it should be cleared here.
    // This requires storing its ID. For now, the animationend handler approach helps.

    if (targetAppearSecond === clickSecond && reactionTime <= TARGET_VISIBLE_DURATION_MS && targetAppearTime) {
        score++;
        scoreDisplay.textContent = score;
        target.classList.add('hit'); 
        target.classList.add('hit-animation');
        target.addEventListener('animationend', function onHitAnimationEnd() {
            target.removeEventListener('animationend', onHitAnimationEnd);
            if (!gamePausedForTutorial) scheduleNextTarget(); // Check if game is paused
        }, { once: true });
    } else {
        target.classList.add('miss'); 
        target.classList.add('miss-animation');
        target.addEventListener('animationend', function onMissAnimationEnd() {
            target.removeEventListener('animationend', onMissAnimationEnd);
            if (!gamePausedForTutorial) scheduleNextTarget(); // Check if game is paused
        }, { once: true });
    }
    
    targetAppearTime = null; 
}

// Replace the existing target click listener with this:
target.addEventListener('click', activateTarget);

// Add keydown listener for Space and Enter keys
target.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { // Check for Enter or Space
        event.preventDefault(); // Prevent default action (e.g., scrolling on space)
        activateTarget(); // Call the same activation function
    }
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
            break;
        case 5: 
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
}

function startTutorial() {
    gamePausedForTutorial = true; 
    if (typeof gameLoopTimeout !== 'undefined' && gameLoopTimeout) {
         clearTimeout(gameLoopTimeout); 
         if (target.classList.contains('appear')) { 
            target.classList.remove('appear');
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
    
    gamePausedForTutorial = false; 
    if (typeof scheduleNextTarget === 'function') {
        scheduleNextTarget(); 
    }
}

tutorialNextBtn.addEventListener('click', nextTutorialStep);
tutorialCloseBtn.addEventListener('click', closeTutorial);

document.addEventListener('DOMContentLoaded', () => {
    // Animation Toggle Logic MUST be inside DOMContentLoaded or after relevant elements
    const animationToggle = document.getElementById('animation-toggle');

    function applyAnimationPreference() {
        if (localStorage.getItem('animationsDisabled') === 'true') {
            document.body.classList.add('animations-disabled');
            if(animationToggle) animationToggle.checked = true;
        } else {
            document.body.classList.remove('animations-disabled');
            if(animationToggle) animationToggle.checked = false;
        }
    }

    if (animationToggle) {
        animationToggle.addEventListener('change', (event) => {
            if (event.target.checked) {
                localStorage.setItem('animationsDisabled', 'true');
            } else {
                localStorage.setItem('animationsDisabled', 'false');
            }
            applyAnimationPreference();
        });
    }
    // Apply preference on initial load
    applyAnimationPreference();


    // Tutorial and Game Start Logic (also needs DOM to be ready)
    if (!tutorialOverlay || !tutorialContent || !tutorialNextBtn || !tutorialCloseBtn || !clockElement || !scoreDisplayElement || !gameAreaElement || !target || !animationToggle) {
        console.error("Required elements not found on DOMContentLoaded. App might not work correctly.");
        // Fallback: try to start game anyway if tutorial elements missing
        if (typeof scheduleNextTarget === 'function') {
             gamePausedForTutorial = false; // Ensure game isn't paused from a previous bad state
             scheduleNextTarget();
        }
        return;
    }
    
    if (localStorage.getItem('tutorialCompleted') !== 'true') {
        startTutorial(); // This will set gamePausedForTutorial = true
    } else {
        tutorialOverlay.classList.add('hidden'); 
        gamePausedForTutorial = false; // Ensure game is not paused
        if (typeof scheduleNextTarget === 'function') {
            scheduleNextTarget(); 
        }
    }
});
