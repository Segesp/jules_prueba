// gameLogic.js
import { CLOCK_HOURS, levels } from './config.js';
import { frontClockState, backClockState, pinStates, currentLevel, setFrontClockState, setBackClockState, setPinState, setCurrentLevel, resetGameMoveCounter, resetLeverUsageTracker } from './state.js';
import { updateLevelDisplay, displayWinState, updatePinVisuals, hideTutorialPromptUI, setLeverDisabledState } from './ui.js'; 
import { createClockHands, setHandRotations } from './gameBoard.js';
// Placeholders - these will be properly imported when the files are created
// import { initializeControls } from './controls.js'; 
// import { checkAndTriggerTutorials, loadTutorialProgress } from './tutorial.js'; 

export function moveHand(clockFaceId, handIndex, steps) {
    let stateArray;
    let currentPinState = false; // Default to no pin active

    if (clockFaceId === 'clock-face-front') {
        stateArray = frontClockState;
        // Check specific pin relevant to front clock and potentially the handIndex
        if (pinStates['front-A'] && (handIndex === 0 || handIndex === 1 || handIndex === 2)) {
            currentPinState = true; // Pin F-A blocks hands 1, 2, 3 (indices 0, 1, 2)
        }
    } else if (clockFaceId === 'clock-face-back') {
        stateArray = backClockState;
        // Currently, no pins affect the back clock in this simplified example
    } else {
        console.error('Invalid clockFaceId for moveHand:', clockFaceId);
        return;
    }

    if (handIndex < 0 || handIndex >= CLOCK_HOURS) {
        console.error('Invalid handIndex for moveHand:', handIndex);
        return;
    }

    // Check for pin blocker BEFORE calculating new position
    if (currentPinState) { 
        console.log(`Movement of front hand ${handIndex + 1} blocked by Pin F-A.`);
        // Optionally, trigger a UI feedback for blocked action here
        return; 
    }

    let currentValueZeroBased = stateArray[handIndex] - 1;
    currentValueZeroBased = (currentValueZeroBased + steps) % CLOCK_HOURS;
    if (currentValueZeroBased < 0) {
        currentValueZeroBased += CLOCK_HOURS;
    }
    stateArray[handIndex] = currentValueZeroBased + 1;

    if (clockFaceId === 'clock-face-front') setFrontClockState([...stateArray]);
    else setBackClockState([...stateArray]);

    setHandRotations(clockFaceId, stateArray); // Update visuals
}

export function checkWinCondition() {
    const targetValue = 12;
    for (let i = 0; i < CLOCK_HOURS; i++) {
        if (frontClockState[i] !== targetValue || backClockState[i] !== targetValue) {
            return false;
        }
    }
    return true;
}

export function setupInitialGameBoard() {
    const levelData = levels.find(l => l.levelNumber === currentLevel);
    
    if (!levelData) {
        console.error("Level data not found for level:", currentLevel, ". Resetting to Level 1.");
        setCurrentLevel(1);
        // It's crucial that 'levels' always has a level 1 definition
        const defaultLevelData = levels.find(l => l.levelNumber === 1);
        if (!defaultLevelData) {
            console.error("FATAL: Default Level 1 data not found! Cannot initialize game.");
            // Display an error to the user or halt further game execution
            const errDiv = document.createElement('div');
            errDiv.textContent = "Error: Game configuration missing. Cannot start.";
            errDiv.style.color = 'red'; errDiv.style.padding = '20px'; errDiv.style.textAlign = 'center';
            document.body.prepend(errDiv);
            return;
        }
        setFrontClockState([...defaultLevelData.frontInitial]);
        setBackClockState([...defaultLevelData.backInitial]);
        // Initialize pin states from default level data or to a default
        if (defaultLevelData.pinStatesInitial) {
            for (const pinId in defaultLevelData.pinStatesInitial) {
                setPinState(pinId, defaultLevelData.pinStatesInitial[pinId]);
            }
        } else {
             setPinState('front-A', false); // Default if not specified
        }
    } else {
        setFrontClockState([...levelData.frontInitial]);
        setBackClockState([...levelData.backInitial]);
        if (levelData.pinStatesInitial) {
            for (const pinId in levelData.pinStatesInitial) {
                setPinState(pinId, levelData.pinStatesInitial[pinId]);
            }
        } else {
            // Default pin state if not defined for the level (e.g., new pins added later)
            setPinState('front-A', false); // Example default
        }
    }
    
    createClockHands('clock-face-front');
    createClockHands('clock-face-back');
    setHandRotations('clock-face-front', frontClockState);
    setHandRotations('clock-face-back', backClockState);
    
    // initializeControls(); // This will be called from main.js
    
    // Update all relevant pin visuals based on the current pinStates
    for (const pinId in pinStates) {
        updatePinVisuals(pinId, pinStates[pinId]);
    }
    
    updateLevelDisplay(currentLevel); 
    displayWinState(false, String(currentLevel), levels.length); 
    setLeverDisabledState(false); // Ensure controls are enabled
    
    resetGameMoveCounter();
    resetLeverUsageTracker();
    
    // hideTutorialPromptUI(); // Called by checkAndTriggerTutorials or other logic
    // checkAndTriggerTutorials('level_start', { level: currentLevel }); // Called from main.js

    if (checkWinCondition()) {
        console.warn("Warning: Initial state for level " + currentLevel + " is already a win state!");
        displayWinState(true, String(currentLevel), levels.length);
    }
}
