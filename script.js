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
// let gameLoopTimeout; // Replaced by mainGameLoopId and rAF logic
let targetAppearTime; 

// Game Configuration
const MIN_APPEAR_DELAY_MS = 100; 
const MAX_APPEAR_DELAY_MS = 800; 
const BASE_TARGET_VISIBLE_DURATION_MS = 700; 

// rAF Game Loop Variables
let mainGameLoopId = null;
let lastTimestamp = 0;
let timeSinceLastSecond = 0; 
const MS_PER_SECOND = 1000;

// --- Target Types and Behaviors Catalog ---
const targetTypes = [
    { 
        id: 'standard',
        points: 1, 
        durationMultiplier: 1.0, 
        cssClasses: ['target-standard'],
        text: '', 
        behavior: null, 
        clicksRequired: 1,
        probability: 0.40 
    },
    { 
        id: 'bonus',
        points: 5, 
        durationMultiplier: 1.0,
        cssClasses: ['target-bonus'],
        text: '+5',
        behavior: null,
        clicksRequired: 1,
        probability: 0.10 
    },
    { 
        id: 'avoid',
        points: -3, 
        durationMultiplier: 1.2, 
        cssClasses: ['target-avoid'],
        text: 'X',
        behavior: null,
        clicksRequired: 1, 
        isAvoid: true, 
        probability: 0.10 
    },
    {
        id: 'quickfade',
        points: 2, 
        durationMultiplier: 0.6, 
        cssClasses: ['target-quickfade'],
        text: '',
        behavior: null,
        clicksRequired: 1,
        probability: 0.10 
    },
    { 
        id: 'multiclick',
        points: 3,
        durationMultiplier: 1.5, 
        cssClasses: ['target-multiclick', 'clicks-3'], 
        text: '3', 
        behavior: 'multiClick',
        clicksRequired: 3,
        probability: 0.10 
    },
    {
        id: 'moving',
        points: 2,
        durationMultiplier: 1.2, 
        cssClasses: ['target-moving', 'target-standard'], 
        text: '',
        behavior: 'moving',
        movementPattern: 'drift', 
        clicksRequired: 1,
        probability: 0.10 
    },
    {
        id: 'shrinking',
        points: 3, 
        durationMultiplier: 1.0, 
        cssClasses: ['target-shrinking', 'target-standard'], 
        text: '',
        behavior: 'sizeChange',
        sizeChangePattern: 'shrink', 
        initialScale: 1.0, 
        finalScale: 0.3,   
        clicksRequired: 1,
        probability: 0.05 
    },
    {
        id: 'growing',
        points: 2, 
        durationMultiplier: 1.0,
        cssClasses: ['target-growing', 'target-standard'],
        text: '',
        behavior: 'sizeChange',
        sizeChangePattern: 'grow',
        initialScale: 1.0,
        finalScale: 1.7,
        clicksRequired: 1,
        probability: 0.05 
    }
]; 

let currentTargetProps = null;
let currentTargetClicks = 0; 

let targetMoveLoopId = null; 
let targetMoveDx = 0; 
let targetMoveDy = 0; 
const TARGET_MOVE_SPEED = 1; 

let targetSizeLoopId = null;
let sizeChangeStartTime = 0;


// --- Target Generation Logic ---
function selectAndSetupNewTarget() {
    let dynamicTargetTypes = JSON.parse(JSON.stringify(targetTypes)); 
    const difficultyFactor = Math.floor(score / 20); 

    if (difficultyFactor > 0) {
        const standardTargetIndex = dynamicTargetTypes.findIndex(t => t.id === 'standard');
        let reductionAmount = difficultyFactor * 0.02; 

        if (standardTargetIndex !== -1 && dynamicTargetTypes[standardTargetIndex].probability > reductionAmount) {
            dynamicTargetTypes[standardTargetIndex].probability -= reductionAmount;
            const otherTypes = dynamicTargetTypes.filter(t => t.id !== 'standard');
            if (otherTypes.length > 0) {
                const increasePerOtherType = reductionAmount / otherTypes.length;
                otherTypes.forEach(t => t.probability += increasePerOtherType);
            }
        }
    }
    
    const rand = Math.random();
    let cumulativeProbability = 0;
    let selectedType = dynamicTargetTypes.find(t => t.id === 'standard') || dynamicTargetTypes[0]; 

    for (const type of dynamicTargetTypes) {
        type.probability = Math.max(0, type.probability); 
        cumulativeProbability += type.probability;
        if (rand <= cumulativeProbability) {
            selectedType = type;
            break;
        }
    }
    if (rand > cumulativeProbability && dynamicTargetTypes.length > 0) {
        selectedType = dynamicTargetTypes.find(t => t.id === 'standard') || dynamicTargetTypes[0];
    }

    currentTargetProps = { ...selectedType, showDelayTimeoutId: null, autoMissTimeoutId: null }; // Initialize timeout IDs
    currentTargetClicks = 0; 

    target.className = ''; 
    target.classList.add('target'); 
    currentTargetProps.cssClasses.forEach(cls => target.classList.add(cls));
    
    if (currentTargetProps.behavior === 'multiClick') {
        target.textContent = String(currentTargetProps.clicksRequired);
    } else {
        target.textContent = currentTargetProps.text || '';
    }
    
    target.style.transform = 'translate(-50%, -50%) scale(0.5)';
    target.style.opacity = '0';
    target.style.left = '50%';
    target.style.top = '50%';

    if (targetMoveLoopId) { cancelAnimationFrame(targetMoveLoopId); targetMoveLoopId = null; }
    if (targetSizeLoopId) { cancelAnimationFrame(targetSizeLoopId); targetSizeLoopId = null; }

    if (currentTargetProps.behavior === 'moving') {
        const angle = Math.random() * 2 * Math.PI;
        targetMoveDx = Math.cos(angle) * TARGET_MOVE_SPEED;
        targetMoveDy = Math.sin(angle) * TARGET_MOVE_SPEED;
    }
    return currentTargetProps;
}

// --- Movement Logic ---
function updateMovingTargetPosition() {
    if (!target.classList.contains('appear') || !currentTargetProps || currentTargetProps.behavior !== 'moving') {
        if (targetMoveLoopId) cancelAnimationFrame(targetMoveLoopId);
        targetMoveLoopId = null;
        return;
    }
    const gameAreaRect = gameAreaElement.getBoundingClientRect();
    let currentXPercent = parseFloat(target.style.left);
    let currentYPercent = parseFloat(target.style.top);
    currentXPercent += (targetMoveDx / gameAreaRect.width) * 100;
    currentYPercent += (targetMoveDy / gameAreaRect.height) * 100;
    const targetWidthPixels = target.offsetWidth; 
    const targetHeightPixels = target.offsetHeight;
    const targetRadiusPercentW = (targetWidthPixels / 2 / gameAreaRect.width) * 100;
    const targetRadiusPercentH = (targetHeightPixels / 2 / gameAreaRect.height) * 100;
    if (currentXPercent + targetRadiusPercentW > 100 || currentXPercent - targetRadiusPercentW < 0) {
        targetMoveDx *= -1;
        currentXPercent += (targetMoveDx / gameAreaRect.width) * 100; 
    }
    if (currentYPercent + targetRadiusPercentH > 100 || currentYPercent - targetRadiusPercentH < 0) {
        targetMoveDy *= -1;
        currentYPercent += (targetMoveDy / gameAreaRect.height) * 100; 
    }
    target.style.left = Math.max(targetRadiusPercentW, Math.min(100 - targetRadiusPercentW, currentXPercent)) + '%';
    target.style.top = Math.max(targetRadiusPercentH, Math.min(100 - targetRadiusPercentH, currentYPercent)) + '%';
    targetMoveLoopId = requestAnimationFrame(updateMovingTargetPosition);
}

// --- Size Change Logic ---
function updateTargetSize() {
    if (!target.classList.contains('appear') || !currentTargetProps || currentTargetProps.behavior !== 'sizeChange') {
        if (targetSizeLoopId) cancelAnimationFrame(targetSizeLoopId);
        targetSizeLoopId = null;
        return;
    }
    const elapsedTime = Date.now() - sizeChangeStartTime;
    const materializeDuration = 400; 
    const fullEffectDuration = (BASE_TARGET_VISIBLE_DURATION_MS * currentTargetProps.durationMultiplier) - materializeDuration;
    let progress = (fullEffectDuration > 0) ? Math.min(elapsedTime / fullEffectDuration, 1) : 1;
    const { initialScale, finalScale } = currentTargetProps; 
    const currentScale = initialScale + (finalScale - initialScale) * progress;
    target.style.transform = `translate(-50%, -50%) scale(${currentScale})`;
    if (progress < 1) {
        targetSizeLoopId = requestAnimationFrame(updateTargetSize);
    } else {
        targetSizeLoopId = null; 
    }
}

// --- Game Core Functions ---
function showTarget() { 
    if (gamePausedForTutorial || document.hidden) return;

    currentTargetProps = selectAndSetupNewTarget();
    const currentVisibleDuration = BASE_TARGET_VISIBLE_DURATION_MS * currentTargetProps.durationMultiplier;
    const randomDelayMs = Math.random() * (MAX_APPEAR_DELAY_MS - MIN_APPEAR_DELAY_MS) + MIN_APPEAR_DELAY_MS;

    currentTargetProps.showDelayTimeoutId = setTimeout(() => {
        if (gamePausedForTutorial) return; // Check again

        target.classList.remove('hit-animation', 'miss-animation', 'hit', 'miss');
        target.classList.add('appear');
        targetAppearTime = new Date().getTime();

        if (currentTargetProps.behavior === 'moving') {
            if (targetMoveLoopId) cancelAnimationFrame(targetMoveLoopId);
            targetMoveLoopId = requestAnimationFrame(updateMovingTargetPosition);
        }
        if (currentTargetProps.behavior === 'sizeChange') {
            setTimeout(() => {
                if (target.classList.contains('appear') && currentTargetProps && currentTargetProps.behavior === 'sizeChange') {
                    sizeChangeStartTime = Date.now();
                    if (targetSizeLoopId) cancelAnimationFrame(targetSizeLoopId);
                    targetSizeLoopId = requestAnimationFrame(updateTargetSize);
                }
            }, 400); // After materialize
        }

        currentTargetProps.autoMissTimeoutId = setTimeout(() => {
            if (target.classList.contains('appear')) {
                if (targetMoveLoopId) { cancelAnimationFrame(targetMoveLoopId); targetMoveLoopId = null; }
                if (targetSizeLoopId) { cancelAnimationFrame(targetSizeLoopId); targetSizeLoopId = null; target.style.transform = 'translate(-50%, -50%) scale(1)'; }
                
                target.classList.remove('appear');
                if (currentTargetProps && currentTargetProps.isAvoid) {
                    target.style.opacity = '0'; // Just disappear
                } else {
                    target.classList.add('miss'); 
                    target.classList.add('miss-animation');
                    target.addEventListener('animationend', function onMissAnimationEnd() {
                        target.removeEventListener('animationend', onMissAnimationEnd);
                        // No scheduleNextTarget(); mainGameLoop handles it.
                    }, { once: true });
                }
            }
        }, currentVisibleDuration);
    }, randomDelayMs);
}

function activateTarget() {
    if (!target.classList.contains('appear') || !currentTargetProps) return;

    if (currentTargetProps.showDelayTimeoutId) clearTimeout(currentTargetProps.showDelayTimeoutId);
    if (currentTargetProps.autoMissTimeoutId) clearTimeout(currentTargetProps.autoMissTimeoutId);
    
    if (targetMoveLoopId) { cancelAnimationFrame(targetMoveLoopId); targetMoveLoopId = null; }
    if (targetSizeLoopId) { cancelAnimationFrame(targetSizeLoopId); targetSizeLoopId = null; target.style.transform = 'translate(-50%, -50%) scale(1)'; }

    const clickTime = new Date().getTime();
    let reactionTime = targetAppearTime ? clickTime - targetAppearTime : 0;

    if (currentTargetProps.behavior === 'multiClick') {
        currentTargetClicks++;
        const clicksRemaining = currentTargetProps.clicksRequired - currentTargetClicks;
        target.textContent = String(clicksRemaining);
        for (let i = currentTargetProps.clicksRequired; i >= 0; i--) target.classList.remove('clicks-' + i);
        if (clicksRemaining > 0) target.classList.add('clicks-' + clicksRemaining);
        target.classList.add('interim-click-feedback'); 
        setTimeout(() => target.classList.remove('interim-click-feedback'), 200); 

        if (currentTargetClicks < currentTargetProps.clicksRequired) {
            if (currentTargetProps.behavior === 'moving') {
                 if (targetMoveLoopId) cancelAnimationFrame(targetMoveLoopId);
                 targetMoveLoopId = requestAnimationFrame(updateMovingTargetPosition);
            }
            if (currentTargetProps.behavior === 'sizeChange') { 
                sizeChangeStartTime = Date.now(); 
                if (targetSizeLoopId) cancelAnimationFrame(targetSizeLoopId);
                targetSizeLoopId = requestAnimationFrame(updateTargetSize);
            }
            target.classList.add('appear'); 
            return; 
        }
    }

    target.classList.remove('appear'); 
    if (currentTargetProps.behavior === 'multiClick') { 
        for (let i = currentTargetProps.clicksRequired; i >= 0; i--) target.classList.remove('clicks-' + i);
    }

    const targetAppearDate = targetAppearTime ? new Date(targetAppearTime) : null;
    const targetAppearSecond = targetAppearDate ? targetAppearDate.getSeconds() : -1;
    const clickDate = new Date(clickTime);
    const clickSecond = clickDate.getSeconds();
    const effectiveVisibleDuration = BASE_TARGET_VISIBLE_DURATION_MS * currentTargetProps.durationMultiplier;
    let hitSuccess = (targetAppearSecond === clickSecond && reactionTime <= effectiveVisibleDuration && targetAppearTime);

    if (hitSuccess) {
        score += currentTargetProps.points; 
        if(currentTargetProps.isAvoid) { /* Penalty applied */ }
        target.classList.add('hit'); target.classList.add('hit-animation'); 
    } else { 
        if (!currentTargetProps.isAvoid) { 
            target.classList.add('miss'); target.classList.add('miss-animation');
        } else { // Clicked an "avoid" target, but LATE. Still a penalty.
            score += currentTargetProps.points; 
            target.classList.add('hit'); target.classList.add('hit-animation'); 
        }
    }
    scoreDisplay.textContent = score;
    if (scoreDisplay) { 
        scoreDisplay.classList.add('updating');
        setTimeout(() => scoreDisplay.classList.remove('updating'), 300);
    }
    
    const animationClassToAdd = target.classList.contains('hit') ? 'hit-animation' : 'miss-animation';
    if (animationClassToAdd === 'hit-animation' && target.classList.contains('miss-animation')) target.classList.remove('miss-animation');
    else if (animationClassToAdd === 'miss-animation' && target.classList.contains('hit-animation')) target.classList.remove('hit-animation');
    
    target.addEventListener('animationend', function onAnimationEnd() {
        target.removeEventListener('animationend', onAnimationEnd);
        if (currentTargetProps.behavior !== 'multiClick' || currentTargetClicks >= currentTargetProps.clicksRequired) target.textContent = '';
        // No scheduleNextTarget(); mainGameLoop handles it.
    }, { once: true });
    targetAppearTime = null;
}

target.addEventListener('click', activateTarget);
target.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { 
        event.preventDefault(); activateTarget(); 
    }
});

// --- Main Game Loop ---
function mainGameLoop(timestamp) {
    if (gamePausedForTutorial || document.hidden) { // Check document.hidden here too
        mainGameLoopId = null; 
        lastTimestamp = 0; // Reset timestamp to correctly calculate deltaTime when loop resumes
        return;
    }

    if (lastTimestamp === 0) lastTimestamp = timestamp;
    const deltaTime = timestamp - lastTimestamp;
    lastTimestamp = timestamp;
    timeSinceLastSecond += deltaTime;

    if (timeSinceLastSecond >= MS_PER_SECOND) {
        timeSinceLastSecond -= MS_PER_SECOND; 
        if (!target.classList.contains('appear') && 
            !target.classList.contains('hit-animation') && 
            !target.classList.contains('miss-animation')) {
            showTarget();
        }
    }
    mainGameLoopId = requestAnimationFrame(mainGameLoop);
}

// --- Interactive Tutorial Logic ---
const tutorialOverlay = document.getElementById('tutorial-overlay');
const tutorialContent = document.getElementById('tutorial-content');
const tutorialNextBtn = document.getElementById('tutorial-next-btn');
const tutorialCloseBtn = document.getElementById('tutorial-close-btn');
const tutorialSteps = Array.from(tutorialContent.querySelectorAll('p[data-step]'));
let currentTutorialStep = 1;
const TOTAL_TUTORIAL_STEPS = 6; 
let gamePausedForTutorial = false;
const clockElement = document.getElementById('clock');
const scoreDisplayElement = document.getElementById('score-display');
const gameAreaElement = document.getElementById('game-area'); 

function showTutorialStep(stepNumber) { /* ... existing logic ... */ 
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
        case 2: clockElement.classList.add('highlight-tutorial'); break;
        case 3: scoreDisplayElement.classList.add('highlight-tutorial'); break;
        case 4: case 5: gameAreaElement.classList.add('highlight-tutorial'); break;
    }
    if (stepNumber === TOTAL_TUTORIAL_STEPS) { 
        tutorialNextBtn.classList.add('hidden');
        tutorialCloseBtn.classList.remove('hidden');
    } else {
        tutorialNextBtn.classList.remove('hidden');
        tutorialCloseBtn.classList.add('hidden');
    }
}
function removeHighlights() { /* ... existing logic ... */ 
    clockElement.classList.remove('highlight-tutorial');
    scoreDisplayElement.classList.remove('highlight-tutorial');
    gameAreaElement.classList.remove('highlight-tutorial');
}
function startTutorial() {
    gamePausedForTutorial = true; 
    if (mainGameLoopId) { cancelAnimationFrame(mainGameLoopId); mainGameLoopId = null; }
    if (targetMoveLoopId) { cancelAnimationFrame(targetMoveLoopId); targetMoveLoopId = null; }
    if (targetSizeLoopId) { cancelAnimationFrame(targetSizeLoopId); targetSizeLoopId = null; }
    
    // Clear any pending timeouts related to showing/hiding targets
    if (currentTargetProps && currentTargetProps.showDelayTimeoutId) clearTimeout(currentTargetProps.showDelayTimeoutId);
    if (currentTargetProps && currentTargetProps.autoMissTimeoutId) clearTimeout(currentTargetProps.autoMissTimeoutId);
    
    if (target.classList.contains('appear')) { 
        target.classList.remove('appear');
        target.style.opacity = '0'; 
        target.style.left = '50%'; target.style.top = '50%';
        target.style.transform = 'translate(-50%, -50%) scale(0.5)'; 
    }
    tutorialOverlay.classList.remove('hidden');
    currentTutorialStep = 1;
    showTutorialStep(currentTutorialStep);
}
function nextTutorialStep() { /* ... existing logic ... */ 
    currentTutorialStep++;
    if (currentTutorialStep <= TOTAL_TUTORIAL_STEPS) showTutorialStep(currentTutorialStep);
}
function closeTutorial() {
    tutorialOverlay.classList.add('hidden');
    removeHighlights();
    localStorage.setItem('tutorialCompleted', 'true');
    gamePausedForTutorial = false; 
    lastTimestamp = 0; // Reset for rAF loop
    timeSinceLastSecond = 0; // Reset accumulator
    if (!mainGameLoopId) mainGameLoopId = requestAnimationFrame(mainGameLoop);
}
tutorialNextBtn.addEventListener('click', nextTutorialStep);
tutorialCloseBtn.addEventListener('click', closeTutorial);

// --- DOMContentLoaded and Visibility Change ---
document.addEventListener('DOMContentLoaded', () => {
    const animationToggle = document.getElementById('animation-toggle');
    function applyAnimationPreference() { /* ... existing logic ... */ 
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
            localStorage.setItem('animationsDisabled', event.target.checked ? 'true' : 'false');
            applyAnimationPreference();
        });
    }
    applyAnimationPreference();

    if (!tutorialOverlay || !tutorialContent || !tutorialNextBtn || !tutorialCloseBtn || !clockElement || !scoreDisplayElement || !gameAreaElement || !target || !animationToggle) {
        console.error("Required elements not found on DOMContentLoaded. App might not work correctly.");
        gamePausedForTutorial = false; 
        if (!mainGameLoopId) mainGameLoopId = requestAnimationFrame(mainGameLoop);
        return;
    }
    
    if (localStorage.getItem('tutorialCompleted') !== 'true') {
        startTutorial(); 
    } else {
        tutorialOverlay.classList.add('hidden'); 
        gamePausedForTutorial = false; 
        if (!mainGameLoopId) mainGameLoopId = requestAnimationFrame(mainGameLoop);
    }
});

document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        if (mainGameLoopId) { cancelAnimationFrame(mainGameLoopId); mainGameLoopId = null; }
        if (currentTargetProps && currentTargetProps.showDelayTimeoutId) clearTimeout(currentTargetProps.showDelayTimeoutId);
        if (currentTargetProps && currentTargetProps.autoMissTimeoutId) clearTimeout(currentTargetProps.autoMissTimeoutId);
        
        if (target.classList.contains('appear')) {
            target.classList.remove('appear');
            if (targetMoveLoopId) { cancelAnimationFrame(targetMoveLoopId); targetMoveLoopId = null; }
            if (targetSizeLoopId) { cancelAnimationFrame(targetSizeLoopId); targetSizeLoopId = null; }
            target.style.opacity = '0'; 
            target.style.transform = 'translate(-50%, -50%) scale(0.5)';
        }
        lastTimestamp = 0; 
    } else {
        if (!gamePausedForTutorial && !mainGameLoopId) { 
            lastTimestamp = 0; 
            timeSinceLastSecond = 0; 
            mainGameLoopId = requestAnimationFrame(mainGameLoop);
        }
    }
});
