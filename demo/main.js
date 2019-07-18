import {RecordPlayer} from '../src/player.js';

let player = new RecordPlayer(document.getElementById('container'), {debug: true, log: true});

let metadata = [
    {
        url: './long.mp4',
        type: 'video/mp4',
        start: new Date('2019-03-22T13:00:00.000Z').getTime(),
        end: new Date('2019-03-22T13:00:27.500Z').getTime(),
    },
    {
        url: './shortr.mp4',
        type: 'video/mp4',
        start: new Date('2019-03-22T13:00:02.300Z').getTime(),
        end: new Date('2019-03-22T13:00:20.000Z').getTime(),
    },
    {
        url: './shortg.mp4',
        type: 'video/mp4',
        start: new Date('2019-03-22T13:00:02.300Z').getTime(),
        end: new Date('2019-03-22T13:00:20.000Z').getTime(),
    },
];

player.load(metadata);


