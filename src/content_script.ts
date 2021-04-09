let micButton: HTMLElement = null
let initialised = false;
let spaceDown = false;
let pttAppOn = true;
let chatOpen = false;

function listenForMicButtonClick() {
    // Unfocus on the mic mute button
    micButton.addEventListener('click', (e) => {
        (document.activeElement as HTMLElement).blur();
    });
}

setInterval(() => findMicButton(), 250);

function findMicButton() {
    // German has a different name for the ctrl key
    // French has no spaces around the plus
    // Japanese uses fullwidth parentheses and has additional text
    const muteButtonTooltip = /\((?:ctrl|strg) ?\+ ?d\)|\uFF08ctrl\+d.*\uFF09/i
    document.querySelectorAll('[data-tooltip]').forEach((element: HTMLElement) => {
        if (element.dataset.tooltip && muteButtonTooltip.test(element.dataset.tooltip)) {
            if (micButton !== element) {
                micButton = element;
                listenForMicButtonClick();
            }
            // Set the mic at the start to muted
            if (initialised === false && micButton.dataset.isMuted === 'false') {
                initialised = true;
                toggleMicButton();
            }
        }
    })
}

// Listen for space key down and when pressed unmute the mic
document.onkeydown = function (e) {
    if (!chatOpen && pttAppOn && micButton && e.key === ' ' && spaceDown === false) {
        spaceDown = true;
        if (micButton.dataset.isMuted === 'true') {
            toggleMicButton();
        }
    }
};

// Listen for space key up and when released mute the mic
document.onkeyup = function (e) {
    if (!chatOpen && pttAppOn && micButton && e.key === ' ' && spaceDown) {
        spaceDown = false;
        if (micButton.dataset.isMuted === 'false') {
            toggleMicButton();
        }
    }
};

function toggleMicButton() {
    micButton.click();
}


// Add PTT Button

setInterval(() => {
    const videoCanvas = document.querySelector('[data-fps-request-screencast-cap]');
    if (!videoCanvas) {
        return;
    }
    const buttons = videoCanvas.parentElement.parentElement.parentElement;

    // Check if the chat window is open
    chatOpen = !!document.querySelector("[name=chatTextInput]");

    if (!buttons.classList.contains('ptt_initialised') && !chatOpen) {
        buttons.classList.add('ptt_initialised');

        // Add Divider line
        buttons.prepend(buttons.children[1].cloneNode());

        const pttButtonContainer: any = document.createElement('div');
        pttButtonContainer.classList = buttons.children[1].classList;
        pttButtonContainer.id = '__ptt-button-container';
        buttons.prepend(pttButtonContainer);

        const pttButtonToggleButton: any = document.createElement('span');
        pttButtonToggleButton.id = '__ptt-button';
        pttButtonToggleButton.onclick = togglePTTApp;
        pttButtonContainer.prepend(pttButtonToggleButton)

        const pttButtonToggleButtonSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        pttButtonToggleButtonSVG.style.width = '24px'
        pttButtonToggleButtonSVG.style.height = '24px'
        pttButtonToggleButtonSVG.setAttribute('viewBox', '0 0 24 24')
        document.querySelector('#__ptt-button').appendChild(pttButtonToggleButtonSVG)

        const pttButtonBackground = document.createElement('div');
        pttButtonBackground.id = '__ptt-button-background';
        pttButtonContainer.appendChild(pttButtonBackground)

        setToggleIcon(pttAppOn)
    }
}, 250);

function togglePTTApp() {
    pttAppOn = !pttAppOn;
    setToggleIcon(pttAppOn);
}

function setToggleIcon(status: boolean) {
    const svgIcon = document.querySelector('#__ptt-button').children[0];
    if (status === true) {
        svgIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 861 695"><g fill="none" fill-rule="evenodd"><path fill="#5F6368" fill-rule="nonzero" d="M693.772 354.067H597V297h263.532v57.067h-96.773V599.63h-69.987zM131.047 297.288c26.786 0 50.042 4.467 69.771 13.402 19.73 8.935 34.922 21.616 45.578 38.045 10.657 16.428 15.985 35.883 15.985 58.364 0 22.193-5.328 41.576-15.985 58.148-10.656 16.573-25.849 29.255-45.578 38.045-19.729 8.791-42.985 13.186-69.77 13.186H70.132v83.44H.146v-302.63h130.901zM127.16 459.41c21.025 0 37.01-4.54 47.954-13.618 10.945-9.08 16.417-21.977 16.417-38.694 0-17.005-5.472-30.047-16.417-39.126-10.944-9.079-26.929-13.618-47.954-13.618H70.133v105.056h57.026z"/><path d="M419.448 404.972c55.61 0 100.165-45.137 100.165-101.052l.335-202.106c0-55.916-44.89-101.052-100.5-101.052s-100.5 45.136-100.5 101.052V303.92c0 55.915 44.89 101.052 100.5 101.052zm-40.2-306.526c0-22.232 18.09-40.421 40.2-40.421 22.11 0 40.2 18.19 40.2 40.42l-.335 208.843c0 22.232-17.755 40.421-39.865 40.421-22.11 0-40.2-18.19-40.2-40.421V98.446zm217.75 205.474c0 101.052-85.09 171.789-177.55 171.789-92.46 0-177.55-70.737-177.55-171.79h-56.95c0 114.864 91.12 209.853 201 226.358v110.485h67V530.277c109.88-16.168 201-111.157 201-226.357h-56.95z" fill="#5F6368" fill-rule="nonzero"/><path d="M13.948-65.238h806v807h-806z"/></g></svg>`
    } else {
        svgIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 861 695"><g fill="none" fill-rule="evenodd"><path fill="#5F6368" fill-rule="nonzero" d="M693.772 354.067H597V297h263.532v57.067h-96.773V599.63h-69.987zM131.047 297.288c26.786 0 50.042 4.467 69.771 13.402 19.73 8.935 34.922 21.616 45.578 38.045 10.657 16.428 15.985 35.883 15.985 58.364 0 22.193-5.328 41.576-15.985 58.148-10.656 16.573-25.849 29.255-45.578 38.045-19.729 8.791-42.985 13.186-69.77 13.186H70.132v83.44H.146v-302.63h130.901zM127.16 459.41c21.025 0 37.01-4.54 47.954-13.618 10.945-9.08 16.417-21.977 16.417-38.694 0-17.005-5.472-30.047-16.417-39.126-10.944-9.079-26.929-13.618-47.954-13.618H70.133v105.056h57.026z"/><path d="M419.448 404.972c55.61 0 100.165-45.137 100.165-101.052l.335-202.106c0-55.916-44.89-101.052-100.5-101.052s-100.5 45.136-100.5 101.052V303.92c0 55.915 44.89 101.052 100.5 101.052zm-40.2-306.526c0-22.232 18.09-40.421 40.2-40.421 22.11 0 40.2 18.19 40.2 40.42l-.335 208.843c0 22.232-17.755 40.421-39.865 40.421-22.11 0-40.2-18.19-40.2-40.421V98.446zm217.75 205.474c0 101.052-85.09 171.789-177.55 171.789-92.46 0-177.55-70.737-177.55-171.79h-56.95c0 114.864 91.12 209.853 201 226.358v110.485h67V530.277c109.88-16.168 201-111.157 201-226.357h-56.95z" fill="#5F6368" fill-rule="nonzero"/><path d="M13.948-65.238h806v807h-806z"/><path stroke="#FFF" stroke-width="10" fill="#5F6368" d="M67.993 55.313L832.288 631.25l-42.73 56.703L25.266 112.016z"/></g></svg>`
    }
}
