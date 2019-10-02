module.exports = {
    verbose: true,
    coverageReporters: ['text'],
    snapshotSerializers: ['jest-serializer-html'],
    setupFilesAfterEnv: [
        '<rootDir>/src/tests/utils/expect-extensions.js',
    ],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/tests/mocks/style.mock.js'
    }
};
