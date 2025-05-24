// config.js
export const CLOCK_HOURS = 12;

export const controlConfigs = [
    { 
        controlId: '0', // Lever 1
        description: 'Moves hands 1, 2, 3 on front CW; corresponding on back CCW.',
        affectedHandsFront: [0, 1, 2], 
        stepsFront: 1, 
        affectedHandsBack: [0, 1, 2],  
        stepsBack: -1 
    },
    { 
        controlId: '1', // Lever 2
        description: 'Moves hands 4, 5, 6 on front CW; corresponding on back CCW.',
        affectedHandsFront: [3, 4, 5], 
        stepsFront: 1,
        affectedHandsBack: [3, 4, 5],
        stepsBack: -1 
    },
    { 
        controlId: '2', // Lever 3
        description: 'Moves hands 7, 8, 9 on front CW; corresponding on back CCW.',
        affectedHandsFront: [6, 7, 8], 
        stepsFront: 1,
        affectedHandsBack: [6, 7, 8],
        stepsBack: -1
    },
    { 
        controlId: '3', // Lever 4 - Updated for Pin Blocker
        description: 'Toggles Pin F-A. Pin F-A blocks hands 1, 2, 3 on the Front Clock when Active.',
        actionType: 'togglePin', 
        pinId: 'front-A',
        // No direct hand movements for this lever anymore
        affectedHandsFront: [], 
        stepsFront: 0,
        affectedHandsBack: [],
        stepsBack: 0
    }
];

export const levels = [
    {
        levelNumber: 1,
        frontInitial: [11, 11, 12, 1, 12, 12, 12, 12, 12, 12, 12, 12],
        backInitial:  [1,  1, 12, 11, 12, 12, 12, 12, 12, 12, 12, 12],
        pinStatesInitial: { 'front-A': false } // Pin F-A is Inactive at the start of Level 1
    },
    {
        levelNumber: 2,
        frontInitial: [3, 6, 9, 12, 3, 6, 9, 12, 3, 6, 9, 12], // Example for Level 2
        backInitial:  [12, 9, 6, 3, 12, 9, 6, 3, 12, 9, 6, 3],  // Example for Level 2
        pinStatesInitial: { 'front-A': true } // Pin F-A starts Active in Level 2
    }
    // Add more levels here
];

export const tutorialStepsConfig = [
    // Level 1
    {
        id: 'level1_start',
        level: 1,
        trigger: 'level_start',
        text: "Welcome to Level 1! Your goal is to set all hands on both clock faces to 12. Use the levers below.",
        highlightElementId: 'puzzle-controls',
        seen: false
    },
    {
        id: 'level1_lever_info',
        level: 1,
        trigger: 'after_N_moves',
        triggerCondition: { moves: 1 },
        text: "Each lever affects specific hands on both the Front (CW) and Back (CCW) clocks. Experiment to see their effects!",
        highlightElementId: null,
        seen: false
    },
    {
        id: 'level1_pin_lever_intro', // Renamed for clarity
        level: 1,
        trigger: 'after_N_moves',
        triggerCondition: { moves: 2, specificLeverUnusedId: '3' }, // After 2 moves, if L4 hasn't been used
        text: "Try Lever 4 (L4). It toggles 'Pin F-A'. This pin can block certain hands on the front clock.",
        highlightLeverId: '3',
        highlightElementId: 'pin-front-A',
        seen: false
    },
    {
        id: 'level1_pin_activated',
        level: 1,
        trigger: 'pin_toggled',
        triggerCondition: { pinId: 'front-A', pinState: true }, // When Pin F-A becomes Active
        text: "Pin F-A is now Active! It blocks hands 1, 2, and 3 on the Front clock. Try moving them.",
        highlightElementId: 'pin-front-A',
        seen: false
    },
    // Level 2
    {
        id: 'level2_start_pin_active',
        level: 2,
        trigger: 'level_start',
        text: "Welcome to Level 2! Notice Pin F-A starts Active. You'll need to manage it to solve the puzzle.",
        highlightElementId: 'pin-front-A',
        seen: false
    },
    {
        id: 'level2_complexity_hint',
        level: 2,
        trigger: 'after_N_moves',
        triggerCondition: { moves: 2 },
        text: "This level requires more planning. Think about how the pin and levers interact!",
        highlightElementId: null,
        seen: false
    }
];
