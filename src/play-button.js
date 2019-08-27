import {Utils} from './utils.js';

export class PlayButton {
    constructor(onPlay, onPause) {
        this.el = Utils.createDomElement('button', 'rp-button rp-button-play');
        this.el.addEventListener('click', () => this.onClick());

        this.onPlay = onPlay;
        this.onPause = onPause;
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
            if (typeof this.onPlay === 'function') {
                this.onPlay();
            }
        } else {
            if (typeof this.onPause === 'function') {
                this.onPause();
            }
        }
    }
}
