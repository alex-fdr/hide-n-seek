export function throttle(callback, delay) {
    let throttling = false;

    return (...args) => {
        if (!throttling) {
            throttling = true;

            callback(...args);

            setTimeout(() => {
                throttling = false;
            }, delay);
        }
    };
}

export function throttleTrailing(callback, limit) {
    let lastFunc;
    let lastRan;

    return (...args) => {
        if (!lastRan) {
            // Run immediately on first call
            callback(...args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            // Schedule to run after 'limit' ms from the last attempt
            lastFunc = setTimeout(
                () => {
                    if (Date.now() - lastRan >= limit) {
                        callback(...args);
                        lastRan = Date.now();
                    }
                },
                limit - (Date.now() - lastRan),
            );
        }
    };
}
