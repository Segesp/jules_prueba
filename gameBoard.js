// gameBoard.js
import { CLOCK_HOURS } from './config.js'; // Assuming CLOCK_HOURS is needed

export function createClockHands(clockFaceId) {
    const clockFace = document.getElementById(clockFaceId);
    if (!clockFace) {
        console.error('Clock face element not found for creating hands:', clockFaceId);
        return;
    }
    clockFace.innerHTML = ''; // Clear any existing hands

    for (let i = 0; i < CLOCK_HOURS; i++) {
        const hand = document.createElement('div');
        hand.classList.add('clock-hand');
        hand.classList.add('hand-' + (i + 1)); 
        hand.dataset.handPosition = (i + 1); 
        clockFace.appendChild(hand);
    }
}

export function setHandRotations(clockFaceId, handStates) {
    const clockFace = document.getElementById(clockFaceId);
    if (!clockFace) {
        console.error('Clock face element not found for setting rotations:', clockFaceId);
        return;
    }

    const hands = clockFace.querySelectorAll('.clock-hand');
    if (hands.length !== CLOCK_HOURS || (handStates && handStates.length !== CLOCK_HOURS)) {
        console.error('Mismatch in hand count or states for', clockFaceId, 'Hands found:', hands.length, 'States provided:', handStates ? handStates.length : 'null');
        return;
    }

    hands.forEach((handElement) => {
        // handPosition is 1-based (e.g., 1 to 12)
        const handPosition = parseInt(handElement.dataset.handPosition);
        // handStates is 0-indexed, so hand at 1 o'clock uses handStates[0]
        const targetHour = handStates[handPosition - 1]; 

        if (typeof targetHour === 'undefined') {
             console.warn(`No state defined for hand ${handPosition} on ${clockFaceId}`);
             return; // Skip this hand if no state defined
        }

        const degrees = (targetHour / CLOCK_HOURS) * 360;
        
        handElement.style.transform = `translateX(-50%) rotate(${degrees}deg)`;
        handElement.dataset.currentValue = targetHour;
    });
}
