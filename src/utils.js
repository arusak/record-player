export const Utils = {
    enableLogging: false,

    /**
     * Creates a single-use event handler
     * @param el element to catch events on
     * @param eventName what event to catch
     * @param callback what to do
     */
    one: (el, eventName, callback) => {
        function handler() {
            callback();
            el.removeEventListener(eventName, handler);
        }

        el.addEventListener(eventName, handler);
    },

    /**
     * Removes all sources from <video> or <audio>
     * @param mediaElement {HTMLMediaElement}
     */
    resetMediaSources: (mediaElement) => {
        mediaElement.removeAttribute('src');
        mediaElement.srcObject = undefined;
        for (let s of mediaElement.getElementsByTagName('source')) {
            s.remove();
        }
    },

    /**
     * Converts number of milliseconds to 'm:SS' string
     */
    formatTime: (ms) => {
        let s = Math.trunc(ms / 1000);
        let m = Math.trunc(s / 60);
        s = s % 60;

        return `${m}:${s < 10 ? '0' : ''}${s}`;
    },

    log(...msgs) {
        if (this.enableLogging) {
            console.log('[RecordPlayer] ', ...msgs);
        }
    }
};
