// tutorial.js
import { tutorialStepsConfig } from './config.js';
import { currentLevel, gameMoveCounter, leverUsageTracker, currentTutorialStepId, setCurrentTutorialStepId } from './state.js';
import { showTutorialPromptUI, hideTutorialPromptUI } from './ui.js';

// Holds the 'seen' status, loaded from localStorage
let seenTutorialSteps = {};

export function loadTutorialProgress() {
    seenTutorialSteps = JSON.parse(localStorage.getItem('seenTutorialsPuzzleClock')) || {};
    tutorialStepsConfig.forEach(step => {
        // Ensure step.seen is correctly initialized based on loaded progress
        step.seen = !!seenTutorialSteps[step.id]; 
    });
}

export function markTutorialStepSeen(stepId) {
    const step = tutorialStepsConfig.find(s => s.id === stepId);
    if (step) step.seen = true; // Update in-memory cache

    seenTutorialSteps[stepId] = true; // Update local variable for current session
    localStorage.setItem('seenTutorialsPuzzleClock', JSON.stringify(seenTutorialSteps));
    
    hideTutorialPromptUI(); 
    setCurrentTutorialStepId(null); // Update global state
}
 
export function checkAndTriggerTutorials(triggerType, triggerParams = {}) {
    const tutorialPromptArea = document.getElementById('tutorial-prompt-area'); // Check if prompt is already active
    if (tutorialPromptArea && !tutorialPromptArea.classList.contains('hidden')) {
        return; // Don't show a new tutorial if one is already visible
    }

    for (const stepConfig of tutorialStepsConfig) {
        if (stepConfig.seen || stepConfig.level !== currentLevel) continue;

        let shouldTrigger = false;
        if (stepConfig.trigger === triggerType) {
            switch (triggerType) {
                case 'level_start':
                    shouldTrigger = true;
                    break;
                case 'after_N_moves':
                    if (triggerParams.moves >= stepConfig.triggerCondition.moves) {
                        if (stepConfig.triggerCondition.specificLeverUnusedId) {
                            if (leverUsageTracker[stepConfig.triggerCondition.specificLeverUnusedId] === false) {
                                shouldTrigger = true;
                            }
                        } else {
                            shouldTrigger = true;
                        }
                    }
                    break;
                case 'pin_toggled':
                    if (stepConfig.triggerCondition.pinId === triggerParams.pinId && 
                        stepConfig.triggerCondition.pinNowActive === triggerParams.pinState) {
                       shouldTrigger = true;
                    }
                    break;
                // Add more cases for 'central_button_pressed', etc. later
            }
        }

        if (shouldTrigger) {
            setCurrentTutorialStepId(stepConfig.id); 
            showTutorialPromptUI(stepConfig.text, stepConfig.highlightElementId, stepConfig.highlightLeverId);
            break; 
        }
    }
}
