let node, bar, viewed, buffered, float, durationDisplay;
let duration, ppms;
let onSeek;

export class Seeker {
    constructor(callback) {
        node = Object.assign(document.createElement('div'), {className: 'seeker'});

        bar = Object.assign(document.createElement('div'), {className: 'bar'});
        node.appendChild(bar);

        bar.addEventListener('click', evt => this.onClick(evt));
        bar.addEventListener('mousemove', evt => this.onMouseMove(evt));
        bar.addEventListener('mouseout', evt => this.onMouseOut(evt));

        viewed = Object.assign(document.createElement('div'), {className: 'viewed'});
        bar.appendChild(viewed);

        buffered = Object.assign(document.createElement('div'), {className: 'buffered'});
        bar.appendChild(buffered);

        float = Object.assign(document.createElement('div'), {className: 'float'});
        node.appendChild(float);

        durationDisplay = Object.assign(document.createElement('div'), {className: 'duration-display'});
        node.appendChild(durationDisplay);

        onSeek = callback;

        this.reset();
    }

    reset() {
        duration = 0;
        this.setPosition(0);
    }

    setDuration(dur) {
        duration = dur;
        ppms = bar.clientWidth / duration;
        durationDisplay.innerText = formatTime(dur);
    }

    setPosition(pos) {
        viewed.style.width = pos * ppms + 'px';
    }

    getNode() {
        return node;
    }

    onClick(evt) {
        this.seekTo(evt.offsetX / ppms);
    }

    onMouseMove(evt) {
        float.style.display = 'block';
        float.innerText = formatTime(evt.offsetX / ppms);
        float.style.left = evt.offsetX - float.clientWidth / 2 + 'px';
    }

    onMouseOut(evt) {
        float.style.display = 'none';
    }

    seekTo(target) {
        onSeek(target);
    }
}

function formatTime(ms) {
    let s = Math.trunc(ms / 1000);
    let m = Math.trunc(s / 60);
    s = s % 60;

    return `${m}:${s < 10 ? '0' : ''}${s}`;

}