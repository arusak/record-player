import {Utils} from './utils.js';

export class PlayButton {
    constructor() {
        this.el = Utils.createDomElement('button', 'rp-button rp-button-play');
        this.el.addEventListener('click', () => this.onClick());
    }

    enable() {
        this.el.removeAttribute('disabled');
    }

    disable() {
        this.el.setAttribute('disabled', 'disabled');
    }

    showPlayIcon() {
        this.el.classList.remove('rp-button-pause');
        this.el.classList.add('rp-button-play');
    }

    showPauseIcon() {
        this.el.classList.add('rp-button-pause');
        this.el.classList.remove('rp-button-play');
    }

    onClick() {
        if (this.el.classList.contains('rp-button-play')) {
            if (this.onplay) {
                this.onplay();
            }
        } else {
            if (this.onpause) {
                this.onpause();
            }
        }
    }
}
