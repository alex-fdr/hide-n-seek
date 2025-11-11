export class Signal {
    constructor() {
        this.listeners = [];
    }

    add(listener) {
        this.listeners.push(listener);
    }

    addOnce(listener) {
        const id = this.listeners.length;

        const onceCallback = (data) => {
            listener(data);
            this.listeners.splice(id, 1);
        };

        this.listeners.push(onceCallback);
    }

    remove() {
        this.listeners = [];
    }

    dispatch(data) {
        for (const listener of this.listeners) {
            listener(data);
        }
    }
}
