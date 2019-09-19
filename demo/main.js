import {RecordPlayer} from '../dist/record-player.es.js';

let player = new RecordPlayer(document.getElementById('container'), {debug: true, log: true});

let metadata = [
    {
        url: './long.mp4',
        type: 'video/mp4',
        offset: 0
    },
    {
        url: './shortr.mp4',
        type: 'video/mp4',
        offset: 2300,
    },
    {
        url: './shortg.mp4',
        type: 'video/mp4',
        offset: 2300,
    },
];

player.load(metadata);


