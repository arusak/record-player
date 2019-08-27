import {PlayButton} from '../play-button.js';

describe('PlayButton', () => {
    let button;

    beforeEach(() => {
        let onplay = () => {
        };

        let onpause = () => {
        };

        button = new PlayButton(onplay, onpause);
    });

    describe('constructor', () => {
        test('button element is created', () => {
            expect(button.el.nodeName).toBe('BUTTON');
        });

        test('button element has needed classes', () => {
            expect(button.el.classList.contains('rp-button')).toBeTruthy();
            expect(button.el.classList.contains('rp-button-play')).toBeTruthy();
        });
    });

    describe('methods', () => {
        test('disable() adds "disabled" attribute', () => {
            button.enable();
            button.disable();
            expect(button.el.getAttribute('disabled')).toBeTruthy();
        });

        test('enable() removes "disabled" attribute', () => {
            button.disable();
            button.enable();
            expect(button.el.getAttribute('disabled')).toBeFalsy();
        });

        test('showPlayIcon() properly toggles classes', () => {
            button.showPauseIcon();
            button.showPlayIcon();
            expect(button.el.classList.contains('rp-button-pause')).toBeFalsy();
            expect(button.el.classList.contains('rp-button-play')).toBeTruthy();
        });

        test('showPauseIcon() properly toggles classes', () => {
            button.showPlayIcon();
            button.showPauseIcon();
            expect(button.el.classList.contains('rp-button-play')).toBeFalsy();
            expect(button.el.classList.contains('rp-button-pause')).toBeTruthy();
        });
    });

    describe('events', () => {
        let spyOnPause;
        let spyOnPlay;

        beforeEach(() => {
            spyOnPause = jest.spyOn(button, 'onPause');
            spyOnPlay = jest.spyOn(button, 'onPlay');
        });

        test('onClick is called on click', () => {
            let spy = jest.spyOn(button, 'onClick');
            button.el.dispatchEvent(new Event('click'));
            expect(spy).toBeCalled();
        });

        test('onPlay is called when paused', () => {
            button.showPlayIcon();
            button.el.dispatchEvent(new Event('click'));
            expect(spyOnPlay).toBeCalled();
            expect(spyOnPause).not.toBeCalled();
        });

        test('onPause is called when playing', () => {
            button.showPauseIcon();
            button.el.dispatchEvent(new Event('click'));
            expect(spyOnPlay).not.toBeCalled();
            expect(spyOnPause).toBeCalled();
        });
    });
});
