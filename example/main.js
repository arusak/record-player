import {RecordPlayer} from '../src/player.js';

let player = new RecordPlayer(document.getElementById('container'), {debug: true, log: true});

let metadata = [
    {
        url: './doctor.webm',
        type: 'video/webm',
        start: new Date('2019-03-22T13:04:51.299Z').getTime(),
        end: new Date('2019-03-22T13:05:33.992Z').getTime(),
    },
    {
        url: './doctorp.webm',
        type: 'video/webm',
        start: new Date('2019-03-22T13:04:51.299Z').getTime(),
        end: new Date('2019-03-22T13:05:33.992Z').getTime(),
    },
    {
        url: './patient.webm',
        type: 'video/webm',
        start: new Date('2019-03-22T13:04:57.291Z').getTime(),
        end: new Date('2019-03-22T13:05:33.912Z').getTime(),
    },
];

player.load(metadata);


