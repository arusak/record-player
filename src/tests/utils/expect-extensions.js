global.expect.extend({
    toHaveClass(received, className) {
        let pass = received.classList.contains(className);
        return {
            message: () => !pass ? 'Element must have class ' + className : 'Element must not have class ' + className,
            pass
        };
    },
    toHaveChildWithClass(received, className) {
        let pass = received.querySelector('.' + className) !== null;
        return {
            message: () => !pass ? 'Element must have child with class ' + className : 'Element must not have child with class ' + className,
            pass
        };
    }
});
