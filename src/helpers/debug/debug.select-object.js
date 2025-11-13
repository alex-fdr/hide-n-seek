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

    action(context) {
        this.scene = context.scene;
        this.camera = context.camera;
        this.selectable = this.scene.children
            .filter(({ type }) => !this.excludeTypes.includes(type))
            .filter(({ children }) => children.every((c) => c.type !== 'Line'))
            .filter(({ name }) => name !== 'transform-controls');

        this.objectSelectionEnabled = true;
        this.bindEvents();
    }

    toggle(status, context) {
        if (this.objectSelectionEnabled === undefined) {
            this.action(context);
        }

        this.objectSelectionEnabled = status;
    }

    bindEvents() {
        const isTouch = 
            'ontouchstart' in document.documentElement ||
            (window.navigator.maxTouchPoints && window.navigator.maxTouchPoints >= 1);

        if (isTouch) {
            window.addEventListener('touchstart', (e) => this.click(e.changedTouches[0]), false);
        } else {
            window.addEventListener('mousedown', (e) => this.click(e), false);
        }

        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));
    }

    onKeyDown(e) {
        if (e.key.toLowerCase() === 'shift') {
            this.isShiftPressed = true;
        }
    }

    onKeyUp(e) {
        if (e.key.toLowerCase() === 'shift') {
            this.isShiftPressed = false;
        }
    }

    click(e) {
        if (!this.objectSelectionEnabled) {
            return;
        }

        if (!this.isShiftPressed) {
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
