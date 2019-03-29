import {Utils} from './utils.js';

let node, bar, viewed, buffered, float, durationDisplay;
let duration;
let onSeek;

export class Seeker {
    constructor(callback) {
        node = Object.assign(document.createElement('div'), {className: 'rp-seeker'});

        bar = Object.assign(document.createElement('div'), {className: 'rp-seeker-bar'});
        node.appendChild(bar);

        bar.addEventListener('click', evt => this.onClick(evt));
        bar.addEventListener('mousemove', evt => this.onMouseMove(evt));
        bar.addEventListener('mouseout', evt => this.onMouseOut(evt));

        viewed = Object.assign(document.createElement('div'), {className: 'rp-seeker-viewed'});
        bar.appendChild(viewed);

        buffered = Object.assign(document.createElement('div'), {className: 'rp-seeker-buffered'});
        bar.appendChild(buffered);

        float = Object.assign(document.createElement('div'), {className: 'rp-seeker-float'});
        node.appendChild(float);

        durationDisplay = Object.assign(document.createElement('div'), {className: 'rp-seeker-duration-display'});
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
        viewed.style.width = ms / duration * 100 + '%';
    }

    getNode() {
        return node;
    }

    onClick(evt) {
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
        onSeek(duration * fraction);
    }
}