let node, total, viewed, buffered, float;
let duration, ppms;
let onSeek;

export class Seeker {
    constructor(callback) {
        node = Object.assign(document.createElement('div'), {className: 'seeker'});

        total = Object.assign(document.createElement('div'), {className: 'total'});
        node.appendChild(total);
        total.addEventListener('click', evt => this.onClick(evt));
        total.addEventListener('mousemove', evt => this.onMouseMove(evt));
        total.addEventListener('mouseout', evt => this.onMouseOut(evt));

        viewed = Object.assign(document.createElement('div'), {className: 'viewed'});
        node.appendChild(viewed);

        buffered = Object.assign(document.createElement('div'), {className: 'buffered'});
        node.appendChild(buffered);

        float = Object.assign(document.createElement('div'), {className: 'float'});
        node.appendChild(float);

        onSeek = callback;

        this.reset();
    }

    reset() {
        duration = 0;
        this.setPosition(0);
    }

    setDuration(dur) {
        duration = dur;
        ppms = total.clientWidth / duration;
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
        float.innerText = Math.round(evt.offsetX / ppms / 1000);
        float.style.left = evt.offsetX - float.clientWidth / 2 + 'px';
    }

    onMouseOut(evt) {
        float.style.display = 'none';
    }

    seekTo(target) {
        onSeek(target);
    }
}