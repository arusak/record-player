let node, total, viewed, buffered;
let duration, position, k;

export class Seeker {
    constructor() {
        node = Object.assign(document.createElement('div'), {className: 'seeker'});

        total = Object.assign(document.createElement('div'), {className: 'total'});
        node.appendChild(total);

        viewed = Object.assign(document.createElement('div'), {className: 'viewed'});
        node.appendChild(viewed);

        buffered = Object.assign(document.createElement('div'), {className: 'buffered'});
        node.appendChild(buffered);

        this.reset();
    }

    reset() {
        duration = 0;
        this.setPosition(0);
    }

    setDuration(dur) {
        duration = dur;
        k = total.clientWidth / duration;
    }

    setPosition(pos) {
        position = pos;
        viewed.style.width = pos * k + 'px';
    }

    getPosition() {
        return position;
    }

    getNode() {
        return node;
    }
}