let loggingEnabled = false;
let debugEnabled = false;

const Config = {
    get loggingEnabled() {
        return loggingEnabled;
    },

    get debugEnabled() {
        return debugEnabled;
    },

    init(options = {}) {
        loggingEnabled = !!options.log;
        debugEnabled = !!options.debug;
    }
};

export default Config;
