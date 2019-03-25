export const Utils = {
    one: (el, eventName, callback) => {
        function handler() {
            callback();
            el.removeEventListener(eventName, handler);
        }

        el.addEventListener(eventName, handler);
    }
};