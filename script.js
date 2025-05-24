// --- Real-Time Clock Update ---
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const clockDisplay = document.getElementById('clock');
    if (clockDisplay) { // Check if the element exists
        clockDisplay.textContent = `${hours}:${minutes}:${seconds}`;
    }
}
// Update the clock immediately and then every second
updateClock(); 
setInterval(updateClock, 1000);


// --- Minimalist Puzzle Clock Game Logic ---

// Global state for the puzzle clock hands
let frontClockState = []; // Array of 12 numbers (1-12), representing the hour each hand points to
let backClockState = [];  // Array of 12 numbers (1-12)

const CLOCK_HOURS = 12;

// DOM Elements (initialized in DOMContentLoaded)
let winMessageElement;
let levers = []; // Will be NodeList

// --- Control Configurations ---
const controlConfigs = [
    { 
        controlId: '0', // Lever 1
        description: 'Moves hands 1, 2, 3 on front CW; corresponding on back CCW.',
        affectedHandsFront: [0, 1, 2], // Affects hands at 1, 2, 3 o'clock
        stepsFront: 1, // Clockwise
        affectedHandsBack: [0, 1, 2],  // Corresponding hands on the back
        stepsBack: -1 // Counter-clockwise
    },
    { 
        controlId: '1', // Lever 2
        description: 'Moves hands 4, 5, 6 on front CW; corresponding on back CCW.',
        affectedHandsFront: [3, 4, 5], // Affects hands at 4, 5, 6 o'clock
        stepsFront: 1,
        affectedHandsBack: [3, 4, 5],
        stepsBack: -1 
    },
    { 
        controlId: '2', // Lever 3
        description: 'Moves hands 7, 8, 9 on front CW; corresponding on back CCW.',
        affectedHandsFront: [6, 7, 8], // Affects hands at 7, 8, 9 o'clock
        stepsFront: 1,
        affectedHandsBack: [6, 7, 8],
        stepsBack: -1
    },
    { 
        controlId: '3', // Lever 4
        description: 'Moves hands 10, 11, 12 on front CW; corresponding on back CCW.',
        affectedHandsFront: [9, 10, 11], // Affects hands at 10, 11, 12 o'clock
        stepsFront: 1,
        affectedHandsBack: [9, 10, 11],
        stepsBack: -1
    }
];

/**
 * Creates 12 clock hands and appends them to the specified clock face.
 * @param {string} clockFaceId - The ID of the clock face element.
 */
function createClockHands(clockFaceId) {
    const clockFace = document.getElementById(clockFaceId);
    if (!clockFace) {
        console.error('Clock face element not found:', clockFaceId);
        return;
    }
    clockFace.innerHTML = ''; 

    for (let i = 0; i < CLOCK_HOURS; i++) { 
        const hand = document.createElement('div');
        hand.classList.add('clock-hand');
        hand.classList.add('hand-' + (i + 1)); 
        hand.dataset.handPosition = (i + 1); 
        clockFace.appendChild(hand);
    }
}

/**
 * Sets the rotation of each hand on a specified clock face.
 * @param {string} clockFaceId - The ID of the clock face element.
 * @param {number[]} handStates - An array of 12 numbers, where each number (1-12) 
 *                                represents the hour value the hand at that position should point to.
 */
function setHandRotations(clockFaceId, handStates) {
    const clockFace = document.getElementById(clockFaceId);
    if (!clockFace) {
        console.error('Clock face element not found for rotation:', clockFaceId);
        return;
    }

    const hands = clockFace.querySelectorAll('.clock-hand');
    if (hands.length !== CLOCK_HOURS || handStates.length !== CLOCK_HOURS) { 
        console.error('Mismatch in hand count or states for', clockFaceId, `Hands: ${hands.length}, States: ${handStates.length}`);
        return;
    }

    hands.forEach((hand, index) => {
        const targetHourValue = handStates[index]; 
        const degrees = (targetHourValue / CLOCK_HOURS) * 360; 
        
        hand.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
        hand.dataset.currentValue = targetHourValue; 
    });
}

/**
 * Updates a single hand on a specified clock face.
 * @param {string} clockFaceId - 'clock-face-front' or 'clock-face-back'.
 * @param {number} handIndex - The index of the hand to move (0-11).
 * @param {number} steps - Number of steps to move (positive for CW, negative for CCW).
 */
function moveHand(clockFaceId, handIndex, steps) {
    let stateArray;
    if (clockFaceId === 'clock-face-front') {
        stateArray = frontClockState;
    } else if (clockFaceId === 'clock-face-back') {
        stateArray = backClockState;
    } else {
        console.error('Invalid clockFaceId for moveHand:', clockFaceId);
        return;
    }

    if (handIndex < 0 || handIndex >= CLOCK_HOURS) {
        console.error('Invalid handIndex for moveHand:', handIndex);
        return;
    }

    let currentValueZeroBased = stateArray[handIndex] - 1;
    currentValueZeroBased = (currentValueZeroBased + steps); 
    currentValueZeroBased = ((currentValueZeroBased % CLOCK_HOURS) + CLOCK_HOURS) % CLOCK_HOURS;
    stateArray[handIndex] = currentValueZeroBased + 1; 
    setHandRotations(clockFaceId, stateArray);
}

/**
 * Checks if the win condition is met (all hands at 12).
 * @returns {boolean} True if win condition is met, false otherwise.
 */
function checkWinCondition() {
    const targetValue = 12; 

    for (let i = 0; i < CLOCK_HOURS; i++) {
        if (frontClockState[i] !== targetValue) {
            return false; 
        }
    }

    for (let i = 0; i < CLOCK_HOURS; i++) {
        if (backClockState[i] !== targetValue) {
            return false; 
        }
    }
    return true; 
}

/**
 * Disables or enables all control levers.
 * @param {boolean} disabled - True to disable, false to enable.
 */
function disableControls(disabled) {
    levers.forEach(lever => {
        lever.disabled = disabled;
    });
}

/**
 * Shows or hides the win message and manages control state.
 * @param {boolean} isWon - True if the game is won, false otherwise.
 */
function displayWinState(isWon) {
    if (winMessageElement) {
        if (isWon) {
            winMessageElement.classList.remove('hidden');
            disableControls(true); 
        } else {
            winMessageElement.classList.add('hidden');
        }
    }
}

/**
 * Initializes event listeners for control levers.
 */
function initializeControls() {
    levers.forEach(lever => {
        lever.addEventListener('click', () => {
            if (lever.disabled) return; 

            const controlId = lever.dataset.controlId;
            const config = controlConfigs.find(c => c.controlId === controlId);

            if (config) {
                lever.classList.add('activated');

                // Assuming pin logic and hand-moving logic are mutually exclusive for a single control
                if (config.actionType === 'togglePin' && config.pinId) {
                    // This part would be for future pin logic if combined
                    // pinStates[config.pinId] = !pinStates[config.pinId];
                    // updatePinVisuals(); 
                } else if (config.affectedHandsFront) { // Check if hand-moving properties exist
                    config.affectedHandsFront.forEach(handIndex => {
                        moveHand('clock-face-front', handIndex, config.stepsFront);
                    });
                    config.affectedHandsBack.forEach(handIndex => {
                        moveHand('clock-face-back', handIndex, config.stepsBack);
                    });
                }
                
                if (checkWinCondition()) {
                    displayWinState(true);
                }

                setTimeout(() => {
                    lever.classList.remove('activated');
                }, 200); // Duration for the "activated" visual feedback

            } else {
                console.warn('No configuration found for control ID:', controlId);
            }
        });
    });
}

/**
 * Sets up the initial state of the game board.
 */
function setupInitialGameBoard() {
    createClockHands('clock-face-front');
    createClockHands('clock-face-back');

    // Level 1 Configuration
    frontClockState = [11, 11, 12, 1, 12, 12, 12, 12, 12, 12, 12, 12]; 
    backClockState =  [1,  1, 12, 11, 12, 12, 12, 12, 12, 12, 12, 12];

    setHandRotations('clock-face-front', frontClockState);
    setHandRotations('clock-face-back', backClockState);
    
    initializeControls(); 
    
    displayWinState(false); 
    disableControls(false); 
    
    const levelNumberSpan = document.getElementById('level-number');
    if (levelNumberSpan) levelNumberSpan.textContent = '1';

    // After setting up a non-win state, check if it accidentally IS a win state.
    // This helps catch issues if the initial setup is too simple or already solved.
    if (checkWinCondition()) {
        console.warn("Warning: Level 1 initial state is already a win state!");
        displayWinState(true); // Should not happen with the above config
    }
}

// --- DOMContentLoaded Event Listener ---
document.addEventListener('DOMContentLoaded', () => {
    winMessageElement = document.getElementById('win-message');
    levers = document.querySelectorAll('.control-lever'); 

    setupInitialGameBoard();
});
