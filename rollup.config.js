import pkg from './package.json';
import css from 'rollup-plugin-css-only';

export default [
    {
        input: 'src/record-player.js',
        output: {
            name: 'RecordPlayer',
            file: pkg.browser,
            format: 'umd'
        },
        plugins: [
            css({output: pkg.style}),
        ]
    },
    {
        input: 'src/record-player.js',
        output: [
            {file: pkg.main, format: 'cjs'},
            {file: pkg.module, format: 'es'}
        ],
        plugins: [
            css({output: false}),
        ]
    }
];
