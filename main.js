import {RecordPlayer} from './player.js';

let player = new RecordPlayer(document.getElementById('container'));

let data = [{
    'id': '38568',
    'fileName': 'telemed-test.medlinesoft.ru-2019_03_22-16_04-37852-1_3-00.webm',
    'started': '2019-03-22T13:04:57.291Z',
    'finished': '2019-03-22T13:05:33.912Z',
    'index': 0
}, {
    'id': '38567',
    'fileName': 'telemed-test.medlinesoft.ru-2019_03_22-16_04-37852-4_4-00.webm',
    'started': '2019-03-22T13:04:51.299Z',
    'finished': '2019-03-22T13:05:33.992Z',
    'index': 0
}];

let metadata = [
    {
        url: './doctor.webm',
        type: 'video/webm',
        start: new Date(data[1].started).getTime(),
        end: new Date(data[1].finished).getTime(),
    },
    {
        url: './patient.webm',
        type: 'video/webm',
        start: new Date(data[0].started).getTime(),
        end: new Date(data[0].finished).getTime(),
    },
];

player.load(metadata);


