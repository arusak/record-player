let loggingEnabled= false;
let debugEnabled= false;


const Config = {
    get loggingEnabled(){
        return loggingEnabled;
    },

    get debugEnabled(){
        return debugEnabled;
    },

    init(options) {
        if (!options) return;
        loggingEnabled = !!options.log;
        debugEnabled = !!options.debug;
    }
};

export default Config;
