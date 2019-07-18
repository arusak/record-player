export class PlayButton {
    constructor() {
        this.el = Object.assign(document.createElement('button'), {className: 'rp-button rp-button-play'});
        this.el.addEventListener('click', () => {
            if (this.el.classList.contains('rp-button-play')) {
                if (this.onplay) {
                    this.onplay();
                }
            } else {
                if (this.onpause) {
                    this.onpause();
                }
            }
        });
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
}
