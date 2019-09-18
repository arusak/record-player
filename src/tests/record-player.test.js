import {RecordPlayer} from '../record-player.js';

describe('RecordPlayer', function () {
    it('should construct itself', () => {
        let player = new RecordPlayer(document.body);
        expect(player).toBeDefined();
    });
});
