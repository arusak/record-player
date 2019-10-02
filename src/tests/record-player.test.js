import {RecordPlayer} from '../record-player.js';

describe('RecordPlayer', function () {
    let player;

    beforeEach(() => {
        player = new RecordPlayer(document.body);
    });

    it('should construct itself', () => {
        expect(player).toBeDefined();
    });

    it('renders correctly', () => {
        const tree = document.querySelector('.rp-player').innerHTML;
        expect(tree).toMatchSnapshot();
    })
});
