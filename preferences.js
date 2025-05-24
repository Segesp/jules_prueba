// preferences.js

export function applyAnimationPreference() {
    const toggle = document.getElementById('animation-toggle');
    if (localStorage.getItem('animationsDisabled') === 'true') {
        document.body.classList.add('animations-disabled');
        if (toggle) toggle.checked = true;
    } else {
        document.body.classList.remove('animations-disabled');
        if (toggle) toggle.checked = false;
    }
}

export function animationToggleLogic(event) {
    localStorage.setItem('animationsDisabled', event.target.checked ? 'true' : 'false');
    applyAnimationPreference();
}

export function applyHighContrastPreference() {
    const toggle = document.getElementById('high-contrast-toggle');
    if (localStorage.getItem('highContrastEnabled') === 'true') {
        document.body.classList.add('high-contrast-mode');
        if (toggle) toggle.checked = true;
    } else {
        document.body.classList.remove('high-contrast-mode');
        if (toggle) toggle.checked = false;
    }
}

export function highContrastToggleLogic(event) {
    localStorage.setItem('highContrastEnabled', event.target.checked ? 'true' : 'false');
    applyHighContrastPreference();
}
