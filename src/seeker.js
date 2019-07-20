import {Utils} from './utils.js';

let node, bar, viewed, buffered, float, durationDisplay;
let duration;
let onSeek;

export class Seeker {
    constructor(callback) {
        node = Utils.createDomElement('div', 'rp-seeker');

        bar = Utils.createDomElement('div', 'rp-seeker-bar');
        node.appendChild(bar);

        bar.addEventListener('click', evt => this.onClick(evt));
        bar.addEventListener('mousemove', evt => this.onMouseMove(evt));
        bar.addEventListener('mouseout', evt => this.onMouseOut(evt));

        viewed = Utils.createDomElement('div', 'rp-seeker-viewed');
        bar.appendChild(viewed);

        buffered = Utils.createDomElement('div', 'rp-seeker-buffered');
        bar.appendChild(buffered);

        float = Utils.createDomElement('div', 'rp-seeker-float');
        node.appendChild(float);

        durationDisplay = Utils.createDomElement('div', 'rp-seeker-duration-display');
        node.appendChild(durationDisplay);

        onSeek = callback;

        duration = 1000;
        this.setPosition(0);
    }

    setDuration(ms) {
        duration = ms;
        durationDisplay.innerText = Utils.formatTime(duration);
    }

    setPosition(ms) {
        Utils.log(`Setting position ${ms}, duration ${duration}`);
        viewed.style.width = ms / duration * 100 + '%';
    }

    getNode() {
        return node;
    }

    onClick(evt) {
        Utils.log(`Clicked to ${evt.offsetX}, clientWidth is ${bar.clientWidth}, fraction is ${evt.offsetX / bar.clientWidth}`);
        this.seekTo(evt.offsetX / bar.clientWidth);
    }

    onMouseMove(evt) {
        float.style.display = 'block';
        float.innerText = Utils.formatTime((evt.offsetX / bar.clientWidth) * duration);
        float.style.left = evt.offsetX - float.clientWidth / 2 + 'px';
    }

    onMouseOut() {
        float.style.display = 'none';
    }

    seekTo(fraction) {
        Utils.log(`Fraction: ${fraction}, duration: ${duration}, seeking: ${duration * fraction}`);
        this.startLoading();
        onSeek(duration * fraction).then(() => this.endLoading());
    }

    startLoading() {
        bar.classList.add('rp-seeker-bar_loading');
    }

    endLoading() {
        bar.classList.remove('rp-seeker-bar_loading');
    }
}
