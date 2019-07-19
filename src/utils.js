import Config from './config.js';

export const Utils = {
    enableLogging: false,

    /**
     * Creates a single-use event handler
     * @param el element to catch events on
     * @param eventName what event to catch
     * @param callback what to do
     */
    one(el, eventName, callback) {
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
    resetMediaSources(mediaElement) {
        mediaElement.removeAttribute('src');
        mediaElement.srcObject = undefined;
        for (let s of mediaElement.getElementsByTagName('source')) {
            s.remove();
        }
    },

    /**
     * Converts number of milliseconds to 'm:SS' string
     */
    formatTime(ms) {
        let s = Math.trunc(ms / 1000);
        let m = Math.trunc(s / 60);
        s = s % 60;

        return `${m}:${s < 10 ? '0' : ''}${s}`;
    },

    /**
     * Creates DOM element with classes and attributes
     * @param name {string} node name
     * @param [className] {string} space separated class names
     * @param [attributes] {Object} key-value dictionary
     * @return {HTMLElement}
     */
    createDomElement(name, className, attributes) {
        let el;
        try {
            el = document.createElement(name);
            if (className) {
                el.className = className;
            }
            if (attributes) {
                Object.assign(el, attributes);
            }
        } catch (e) {
            Utils.log(`Error creating <${name}>`, e);
        }

        return el;
    },

    log(...msgs) {
        if (Config.loggingEnabled) {
            console.log('[RecordPlayer] ', ...msgs);
        }
    }
};
