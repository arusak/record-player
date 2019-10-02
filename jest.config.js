module.exports = {
    verbose: true,
    coverageReporters: ['text'],
    setupFilesAfterEnv: [
        '<rootDir>/src/tests/utils/expect-extensions.js',
    ],
    moduleNameMapper: {
        '\\.css$': '<rootDir>/src/tests/mocks/style.mock.js'
    }
};
