import {Seeker} from '../seeker.js';
import '@testing-library/jest-dom/extend-expect'
import {fireEvent} from '@testing-library/dom';

describe('Seeker', function () {
    const floatClassName = 'rp-seeker-float';
    const barClassName = 'rp-seeker-bar';
    const durationClassName = 'rp-seeker-duration-display';
    const viewedClassName = 'rp-seeker-viewed';

    const defaultDuration = 10000;

    const onClickCallback = () => {
    };

    let seeker;
    let node;
    let float;
    let bar;
    let duration;
    let viewed;

    beforeEach(() => {
        seeker = new Seeker(onClickCallback);
        node = seeker.getNode();
        float = seeker.getNode().querySelector('.' + floatClassName);
        bar = seeker.getNode().querySelector('.' + barClassName);
        duration = seeker.getNode().querySelector('.' + durationClassName);
        viewed = seeker.getNode().querySelector('.' + viewedClassName);

        Object.defineProperty(window.HTMLDivElement.prototype, 'clientWidth', {value: 100});

        seeker.setDuration(defaultDuration);
        seeker.setPosition(0);
    });

    describe('constructor', function () {
        it('should construct itself', () => {
            expect(seeker).toBeDefined();
        });
    });

    describe('float behavior', function () {
        // jsdom won't let it
        xit('should be hidden initially', function () {
            console.log('float display:', getComputedStyle(float).display);

            expect(float).not.toBeVisible();
        });

        it('should appear on mousemove over bar', function () {
            fireEvent.mouseMove(bar);
            expect(float).toBeVisible();
        });

        it('should disappear on mouseout over bar', function () {
            fireEvent.mouseMove(bar);
            fireEvent.mouseOut(bar);
            expect(float).not.toBeVisible();
        });

        it('should contain 0:00 initially', () => {
            // Object.defineProperty(window.MouseEvent.prototype, 'offsetX', {value: 0});
            window.MouseEvent.prototype.offsetX = 0;
            fireEvent.mouseMove(bar);
            expect(float.innerText).toBe('0:00');
            fireEvent.mouseOut(bar);
        });

        it('should contain 0:10 at end of seeker bar', () => {
            window.MouseEvent.prototype.offsetX = 100;
            fireEvent.mouseMove(bar);
            expect(float.innerText).toBe('0:10');
            fireEvent.mouseOut(bar);
        });
    });

    describe('duration display', function () {
        it('should display seconds', function () {
            expect(duration.innerText).toBe('0:10');
            seeker.setDuration(1000);
            expect(duration.innerText).toBe('0:01');
            seeker.setDuration(60000);
            expect(duration.innerText).toBe('1:00');
        });
    });

    describe('viewed bar', function () {
        it('should initially have zero width', function () {
            expect(parseInt(viewed.style.width, 10)).toBe(0);
        });

        it('should be at middle if position is in the middle', function () {
            seeker.setPosition(defaultDuration / 2);
            expect(parseInt(viewed.style.width, 10)).toBeCloseTo(50, 1);
        });

        it('should be at end if position is in the end', function () {
            seeker.setPosition(defaultDuration);
            expect(parseInt(viewed.style.width, 10)).toBe(100);
        });
    });

    describe('click', function () {
        it('should call constructor callback on click', function () {
            // spyOn()
        });
    });

    describe('getNode', function () {
        let node;

        beforeEach(() => {
            node = seeker.getNode();
        });
        it('should return a defined object', function () {
            expect(node).toBeDefined();
        });
        it('should return a DOM element', function () {
            expect(node.nodeType).toBe(Node.ELEMENT_NODE);
        });
        it('should return an element with class "rp-seeker"', function () {
            expect(node).toHaveClass('rp-seeker');
        });
        it('should contain an element with class "' + barClassName + '"', function () {
            expect(node).toHaveChildWithClass(barClassName);
        });
        it('should contain an element with class "' + floatClassName + '"', function () {
            expect(node).toHaveChildWithClass(floatClassName);
        });
        it('should contain an element with class "rp-seeker-viewed"', function () {
            expect(node).toHaveChildWithClass('rp-seeker-viewed');
        });
        it('should contain an element with class "rp-seeker-buffered"', function () {
            expect(node).toHaveChildWithClass('rp-seeker-buffered');
        });
        it('should contain an element with class "rp-seeker-duration-display"', function () {
            expect(node).toHaveChildWithClass('rp-seeker-duration-display');
        });
    });
});
