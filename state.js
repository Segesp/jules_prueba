// state.js
export let frontClockState = [];
export let backClockState = [];
export let pinStates = { 'front-A': false }; // Default initial state for Level 1
export let currentLevel = 1; // Default initial level
export let gameMoveCounter = 0;
export let leverUsageTracker = { '0': false, '1': false, '2': false, '3': false };

export let currentTutorialStepId = null;

// For the rAF main game loop (if one is used broadly, otherwise specific to its module)
// export let mainGameLoopId = null; // Assuming this might be managed in main.js or gameLoop.js
// export let lastTimestamp = 0;
// export let timeSinceLastSecond = 0; 
// export const MS_PER_SECOND = 1000; // Moved to config.js if it's a static config

// Functions to modify state (examples)
export function setFrontClockState(newState) { frontClockState = newState; }
export function setBackClockState(newState) { backClockState = newState; }
export function setCurrentLevel(level) { currentLevel = level; }
export function resetGameMoveCounter() { gameMoveCounter = 0; }
export function incrementGameMoveCounter() { gameMoveCounter++; }
export function resetLeverUsageTracker() { 
    leverUsageTracker = { '0': false, '1': false, '2': false, '3': false };
}
export function markLeverAsUsed(leverId) {
    if (leverUsageTracker.hasOwnProperty(leverId)) {
        leverUsageTracker[leverId] = true;
    }
}
export function setPinState(pinId, isActive) {
   if (pinStates.hasOwnProperty(pinId)) {
       pinStates[pinId] = isActive;
   } else {
       // If the pinId doesn't exist, maybe initialize it
       pinStates[pinId] = isActive;
       console.warn(`Pin ${pinId} was not in initial pinStates, it has been added.`);
   }
}
export function togglePinState(pinId) {
    if (pinStates.hasOwnProperty(pinId)) {
        pinStates[pinId] = !pinStates[pinId];
    } else {
        pinStates[pinId] = true; // Default to true if not existing
        console.warn(`Pin ${pinId} was not in initial pinStates, it has been added and set to true.`);
    }
}

export function setCurrentTutorialStepId(stepId) { currentTutorialStepId = stepId; }

// Pin Blocker specific states for the puzzle game
export const initialPinStates = { 'front-A': false }; // Default for level 1

// It's better to manage these specific rAF variables within the module that runs the loop.
// If main.js runs the loop, they'd be there. If a gameLoop.js module, then there.
// For now, I'll remove them from here to avoid confusion if they are not universally "state".
// If they are truly global state that many modules need to read/write, then this could be a place.
// However, loop control IDs are usually local to the loop manager.
// MS_PER_SECOND is a good candidate for config.js.
// lastTimestamp and timeSinceLastSecond are very specific to the loop's internal working.

export const MS_PER_SECOND = 1000; // Re-adding here if not in config.js, but better in config.js
                                   // Self-correction: Moved to config.js in the plan.
                                   // Will remove from here and ensure it's in config.js

// Note: Based on the plan, MS_PER_SECOND should be in config.js.
// I will remove it from here and ensure it's in config.js when that's created/updated.
// For now, keeping the state modification functions.
// The rAF main loop variables (mainGameLoopId, lastTimestamp, timeSinceLastSecond)
// will be removed from this file as they are better managed by the loop itself.
// The plan for script.js cleanup will handle removing their old global declarations.
// Pin states are definitely game state.
// Lever usage and move counter are game state.
// Current level is game state.
// Clock hand states are game state.
// Tutorial step ID is UI state.
