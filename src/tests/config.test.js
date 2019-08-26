import Config from '../config.js';

describe('Config object', () => {
    test('option "log" should enable logging', () => {
        Config.init({log: true});
        expect(Config.loggingEnabled).toBe(true);
    });

    test('option "debug" should enable debugging', () => {
        Config.init({debug: true});
        expect(Config.debugEnabled).toBe(true);
    });

    describe('with empty options', () => {
        beforeAll(() => {
            Config.init();
        });
        test('should leave debugging disabled', () => {
            expect(Config.debugEnabled).toBe(false);
        });
        test('should leave logging disabled', () => {
            expect(Config.loggingEnabled).toBe(false);
        });
    })
});
