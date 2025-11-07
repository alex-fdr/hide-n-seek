export class InputSystem {
    constructor(domElement) {
        this.domElement = domElement;

        this.enabled = false;
        this.handler = null;
        this.mouseEvents = ['mousedown', 'mousemove', 'mouseup'];
        this.touchEvents = ['touchstart', 'touchmove', 'touchend'];

        this.callbacks = { down: [], move: [], up: [] };
    }

    init() {
        const supportTouchEvent = 'ontouchstart' in document.documentElement;
        const isTouch = supportTouchEvent || navigator?.maxTouchPoints >= 1;
        const [down, move, up] = isTouch ? this.touchEvents : this.mouseEvents;

        this.domElement.addEventListener(down, (e) => {
            if (!this.enabled) {
                return;
            }

            if (e?.touches?.length > 1) {
                e.preventDefault();
            }

            if (this.handler) {
                this.handler.down(this.getEvent(e));

                for (const cb of this.callbacks.down) {
                    cb(this.handler.status);
                }
            }
        });

        this.domElement.addEventListener(move, (e) => {
            if (this.handler?.pressed) {
                this.handler.move(this.getEvent(e));

                for (const cb of this.callbacks.move) {
                    cb(this.handler.status);
                }
            }
        });

        this.domElement.addEventListener(up, (e) => {
            if (this.handler) {
                this.handler.up(this.getEvent(e));

                for (const cb of this.callbacks.up) {
                    cb(this.handler.status);
                }
            }
        });
    }

    setHandler(handler) {
        this.handler = handler;
        this.enabled = true;
    }

    getEvent(e) {
        return e.changedTouches ? e.changedTouches[0] : e;
    }

    onDown(cb) {
        this.callbacks.down.push(cb);
    }

    onMove(cb) {
        this.callbacks.move.push(cb);
    }

    onUp(cb) {
        this.callbacks.up.push(cb);
    }
}
