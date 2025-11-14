import { Raycaster, Vector2 } from 'three';

export class DebugSelectObject {
    constructor(onActionComplete) {
        this.excludeTypes = [
            'LineSegments',
            'DirectionalLight',
            'HemisphereLight',
            'Line',
        ];
        this.selectable = [];
        this.isShiftPressed = false;
        this.intersected = null;
        this.raycaster = new Raycaster();
        this.pointer = new Vector2();
        this.onActionComplete = onActionComplete;
    }

    action({ scene, camera }) {
        this.camera = camera;
        this.selectable = scene.children
            .filter(({ type }) => !this.excludeTypes.includes(type))
            .filter(({ children }) => children.every((c) => c.type !== 'Line'))
            .filter(({ name }) => name !== 'transform-controls');

        this.objectSelectionEnabled = true;
        this.bindEvents();
    }

    toggle(status, context) {
        if (!this.selectable.length) {
            this.action(context);
        }

        this.objectSelectionEnabled = status;
    }

    bindEvents() {
        const hasTouchEvent = 'ontouchstart' in document.documentElement;
        const hasTouchPoints = window.navigator.maxTouchPoints >= 1;
        const isTouch = hasTouchEvent || hasTouchPoints;
        const eventName = isTouch ? 'touchstart' : 'mousedown';
        
        window.addEventListener(eventName, (e) => {
            this.handleClick(isTouch ? e.changedTouches[0] : e);
        }, false);

        window.addEventListener('keydown', (e) => {
            if (e.key.toLowerCase() === 'shift') {
                this.isShiftPressed = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (e.key.toLowerCase() === 'shift') {
                this.isShiftPressed = false;
            }
        });
    }

    handleClick(e) {
        if (!this.objectSelectionEnabled || !this.isShiftPressed) {
            return;
        }

        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const [firstIntersect] = this.raycaster.intersectObjects(this.selectable, true);

        if (firstIntersect && firstIntersect.object !== this.intersected) {
            this.intersected = firstIntersect.object;
        }

        this.onActionComplete?.(this.intersected);
    }
}
