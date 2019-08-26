import {PlayButton} from '../play-button.js';

describe('PlayButton', () => {
    let button;

    beforeEach(() => {
        button = new PlayButton();
    });

    test('button element is created', () => {
        expect(button.el.nodeName).toBe('BUTTON');
    });
});
