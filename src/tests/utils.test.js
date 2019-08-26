import {Utils} from '../utils.js';

describe('Utils object', () => {
    describe('formatTime', () => {
            test('should show 0:00 for 0 ms', () => {
                expect(Utils.formatTime(0)).toBe('0:00')
            });
            test('should show 0:00 for < 1000 ms', () => {
                expect(Utils.formatTime(1)).toBe('0:00');
                expect(Utils.formatTime(100)).toBe('0:00');
                expect(Utils.formatTime(999)).toBe('0:00');
            });
            test('should show 0:01 for 1000 ms', () => {
                expect(Utils.formatTime(1000)).toBe('0:01')
            });
            test('should show 0:11 for 11,111 ms', () => {
                expect(Utils.formatTime(11111)).toBe('0:11')
            });
            test('should show 1:00 for 60,000 ms', () => {
                expect(Utils.formatTime(60 * 1000)).toBe('1:00')
            });
            test('should show 10:00 for 600,000 ms', () => {
                expect(Utils.formatTime(600 * 1000)).toBe('10:00')
            });
            test('should show 100:00 for 6,000,000 ms', () => {
                expect(Utils.formatTime(6000 * 1000)).toBe('100:00')
            });
        }
    )
});

