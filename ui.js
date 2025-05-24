// ui.js
import { applyAnimationPreference, applyHighContrastPreference, animationToggleLogic, highContrastToggleLogic } from './preferences.js';

// DOM Element Variables (initialized in initUI)
let clockDisplayRealTime = null;
let levelNumberSpan = null;
let puzzleInstructionsPara = null;

let pinFrontAIndicator = null;
let pinFrontAStateSpan = null;

let tutorialPromptArea = null;
let tutorialPromptText = null;
let tutorialPromptNextBtn = null;

let accessibilityControlsContainer = null;
let animationToggle = null;
let highContrastToggle = null;

let winMessageElement = null;
let resetLevelButton = null; // Note: Event listener for this is often in main.js or gameLogic.js
let nextLevelButton = null;  // Note: Event listener for this is often in main.js or gameLogic.js

export function initUI() {
    clockDisplayRealTime = document.getElementById('clock');
    levelNumberSpan = document.getElementById('level-number');
    puzzleInstructionsPara = document.getElementById('puzzle-instructions');

    pinFrontAIndicator = document.getElementById('pin-front-A');
    if (pinFrontAIndicator) {
        pinFrontAStateSpan = pinFrontAIndicator.querySelector('.pin-state');
    }

    tutorialPromptArea = document.getElementById('tutorial-prompt-area');
    tutorialPromptText = document.getElementById('tutorial-prompt-text');
    tutorialPromptNextBtn = document.getElementById('tutorial-prompt-next-btn');

    accessibilityControlsContainer = document.getElementById('accessibility-controls');
    animationToggle = document.getElementById('animation-toggle');
    highContrastToggle = document.getElementById('high-contrast-toggle');
    
    winMessageElement = document.getElementById('win-message');
    resetLevelButton = document.getElementById('reset-level-btn'); 
    nextLevelButton = document.getElementById('next-level-btn');   

    // Initialize real-time clock
    if (clockDisplayRealTime) {
       updateClock(); // Initial call
       setInterval(updateClock, 1000); // Update every second
    }

    // Initialize accessibility toggles
    if (animationToggle) {
       animationToggle.addEventListener('change', animationToggleLogic);
       applyAnimationPreference(); // Apply on load
    } else {
        console.warn("Animation toggle not found.");
    }
    if (highContrastToggle) {
       highContrastToggle.addEventListener('change', highContrastToggleLogic);
       applyHighContrastPreference(); // Apply on load
    } else {
        console.warn("High contrast toggle not found.");
    }
    
    console.log("UI Initialized");
}

// Real-time clock
export function updateClock() {
    if (!clockDisplayRealTime) return;
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    clockDisplayRealTime.textContent = `${hours}:${minutes}:${seconds}`;
}

// --- Puzzle Game UI Functions ---
export function updateLevelDisplay(level) {
    if (levelNumberSpan) levelNumberSpan.textContent = level;
}

export function updatePuzzleInstructions(text) { 
     if(puzzleInstructionsPara) puzzleInstructionsPara.textContent = text;
}

export function displayWinState(isWon, currentLevelText, totalLevels) { 
    if (winMessageElement) {
        if (isWon) {
            winMessageElement.textContent = "Level " + currentLevelText + " Complete!";
            winMessageElement.classList.remove('hidden');
            if (nextLevelButton) {
                if (parseInt(currentLevelText, 10) < totalLevels) { 
                    nextLevelButton.classList.remove('hidden');
                } else {
                    nextLevelButton.classList.add('hidden');
                    winMessageElement.textContent = "All levels complete! Congratulations!";
                }
            }
        } else {
            winMessageElement.classList.add('hidden');
            if (nextLevelButton) nextLevelButton.classList.add('hidden');
        }
    }
}

export function updatePinVisuals(pinId, isActive) { 
    // For now, only one pin 'front-A'
    if (pinId === 'front-A' && pinFrontAStateSpan) {
        if (isActive) {
            pinFrontAStateSpan.textContent = 'Active';
            pinFrontAStateSpan.classList.add('active');
            pinFrontAStateSpan.classList.remove('inactive');
        } else {
            pinFrontAStateSpan.textContent = 'Inactive';
            pinFrontAStateSpan.classList.add('inactive');
            pinFrontAStateSpan.classList.remove('active');
        }
    } else if (pinId === 'front-A' && !pinFrontAStateSpan) {
        // Fallback or create if critical, for now just log
        // console.warn("pinFrontAStateSpan not found for pin-front-A")
    }
}

export function showTutorialPromptUI(text, highlightElementId, highlightLeverId) {
    if (!tutorialPromptArea || !tutorialPromptText) return;
    tutorialPromptText.textContent = text;
    removeHighlights(); 
    if (highlightElementId) {
        const elToHighlight = document.getElementById(highlightElementId);
        if (elToHighlight) elToHighlight.classList.add('highlight-tutorial');
    }
    if (highlightLeverId) {
        const leverToHighlight = document.querySelector(`.control-lever[data-control-id="${highlightLeverId}"]`);
        if (leverToHighlight) leverToHighlight.classList.add('highlight-tutorial');
    }
    tutorialPromptArea.classList.remove('hidden');
}

export function hideTutorialPromptUI() {
    if (tutorialPromptArea) tutorialPromptArea.classList.add('hidden');
    removeHighlights();
}

export function removeHighlights() {
    document.querySelectorAll('.highlight-tutorial').forEach(el => el.classList.remove('highlight-tutorial'));
}

export function setLeverDisabledState(disabled) { 
     const allLevers = document.querySelectorAll('.control-lever'); // Query here as levers might not be initialized in this module's scope
     allLevers.forEach(lever => {
         lever.disabled = disabled;
     });
}
