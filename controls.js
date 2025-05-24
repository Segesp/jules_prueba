// controls.js
import { controlConfigs } from './config.js';
import { 
    pinStates, setPinState, 
    currentLevel, gameMoveCounter, incrementGameMoveCounter, markLeverAsUsed 
} from './state.js';
import { updatePinVisuals, displayWinState as uiDisplayWinState, setLeverDisabledState as uiSetLeverDisabledState } from './ui.js'; // Renamed to avoid conflict
import { moveHand, checkWinCondition } from './gameLogic.js';
import { checkAndTriggerTutorials as triggerTutorialChecks } from './tutorial.js'; // Renamed to avoid conflict

let levers = []; // Module-scoped cache for lever elements

export function initializeControls() {
    levers = document.querySelectorAll('.control-lever'); // Select levers once

    levers.forEach(lever => {
        lever.addEventListener('click', () => {
            if (lever.disabled) return; // Don't do anything if controls are disabled (e.g., game won)

            const controlId = lever.dataset.controlId;
            const config = controlConfigs.find(c => c.controlId === controlId);

            // Lever activation visual feedback (managed by ui.js or directly)
            lever.classList.add('activated');
            setTimeout(() => {
                lever.classList.remove('activated');
            }, 200);

            if (config) {
                if (config.actionType === 'togglePin' && config.pinId) {
                    const currentPinState = !pinStates[config.pinId]; // Calculate new state
                    setPinState(config.pinId, currentPinState); // Update state
                    lever.setAttribute('aria-pressed', currentPinState); // Update ARIA attribute
                    updatePinVisuals(config.pinId, currentPinState); // Update UI
                    // Trigger tutorial for pin toggle
                    triggerTutorialChecks('pin_toggled', { level: currentLevel, pinState: currentPinState });
                } else if (config.affectedHandsFront) {
                    // Apply to front clock
                    config.affectedHandsFront.forEach(handIndex => {
                        moveHand('clock-face-front', handIndex, config.stepsFront);
                    });
                    // Apply to back clock
                    config.affectedHandsBack.forEach(handIndex => {
                        moveHand('clock-face-back', handIndex, config.stepsBack);
                    });
                }
                
                incrementGameMoveCounter();
                markLeverAsUsed(controlId);

                if (checkWinCondition()) {
                    // Pass total levels from config or state if available
                    // For now, assuming levels array is imported or length is known
                    const totalLevels = 2; // Placeholder, should get from levels.length in config.js
                    uiDisplayWinState(true, String(currentLevel), totalLevels); 
                    triggerTutorialChecks('level_won', { level: currentLevel }); 
                } else {
                    triggerTutorialChecks('after_N_moves', { level: currentLevel, moves: gameMoveCounter, leverId: controlId });
                }
            } else {
                console.warn('No configuration found for control ID:', controlId);
            }
        });
    });
    console.log("Controls Initialized");
}
