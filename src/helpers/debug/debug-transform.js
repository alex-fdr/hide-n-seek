import { Raycaster, Vector2 } from 'three';
import { TransformControls } from 'three/addons/controls/TransformControls';

export class DebugTransform {
    constructor(onActionComplete) {
        this.controls = null;
        this.actions = {};
        this.keymap = {};
        this.onActionComplete = onActionComplete;

        this.excludeTypes = [
            'LineSegments',
            'DirectionalLight',
            'HemisphereLight',
            'Line',
        ];
        this.selectable = [];
        // this.isShiftPressed = false;
        this.intersected = null;
        this.raycaster = new Raycaster();
        this.pointer = new Vector2();
    }

    action({ camera, renderer, scene, controls: { orbit } }) {
        this.camera = camera;

        this.controls = new TransformControls(camera, renderer.domElement);
        const helper = this.controls.getHelper();
        helper.name = 'transform-controls';
        scene.add(helper);

        this.actions = this.initActionsList(this.controls);
        this.keymap = this.initKeymap(this.actions);
        this.selectable = this.filterSelectableObjects(scene);

        this.bindEvents(orbit);
    }

    initActionsList(ctrl) {
        return {
            translate: () => ctrl.setMode('translate'),
            rotate: () => ctrl.setMode('rotate'),
            scale: () => ctrl.setMode('scale'),
            xAxis: () => {
                ctrl.showX = true;
                ctrl.showY = ctrl.showY === ctrl.showZ ? !ctrl.showY : false;
                ctrl.showZ = ctrl.showY;
            },
            yAxis: () => {
                ctrl.showX = ctrl.showX === ctrl.showZ ? !ctrl.showX : false;
                ctrl.showY = true;
                ctrl.showZ = ctrl.showX;
            },
            zAxis: () => {
                ctrl.showX = ctrl.showX === ctrl.showY ? !ctrl.showX : false;
                ctrl.showY = ctrl.showX;
                ctrl.showZ = true;
            },
            selectMode: (status = true) => {
                ctrl.isShiftPressed = status;
            },
            snap: () => {
                if (!ctrl.translationSnap) {
                    ctrl.setTranslationSnap(1);
                    ctrl.setRotationSnap(15 * (Math.PI / 180));
                } else {
                    ctrl.setTranslationSnap(null);
                    ctrl.setRotationSnap(null);
                }
            },
            worldLocalSpace: () => {
                ctrl.setSpace(ctrl.space === 'local' ? 'world' : 'local');
            },
            reset: () => {
                ctrl.detach();
                ctrl.showX = ctrl.showY = ctrl.showZ = true;
            },
            controlsSizeBigger: () => {
                ctrl.setSize(ctrl.size + 0.1);
            },
            controlsSizeSmaller: () => {
                ctrl.setSize(Math.max(ctrl.size - 0.1, 0.1));
            },
        };
    }

    initKeymap(actions) {
        return {
            x: () => actions.xAxis(),
            y: () => actions.yAxis(),
            z: () => actions.zAxis(),
            w: () => actions.translate(),
            g: () => actions.translate(),
            r: () => actions.rotate(),
            s: () => actions.scale(),
            q: () => actions.worldLocalSpace(),
            shift: (s) => actions.selectMode(s),
            control: () => actions.snap(),
            escape: () => actions.reset(),
            '+': () => actions.controlsSizeBigger(),
            '=': () => actions.controlsSizeBigger(),
            '-': () => actions.controlsSizeSmaller(),
            _: () => actions.controlsSizeSmaller(),
        };
    }

    bindEvents(orbit) {
        this.controls.addEventListener('mouseUp', () => {
            this.onActionComplete?.(this.controls.object);
        });

        this.controls.addEventListener('dragging-changed', (event) => {
            if (orbit?.controls) {
                orbit.controls.enabled = !event.value;
            }
        });

        window.addEventListener('keydown', (event) => {
            const key = event.key.toLowerCase();
            const isShiftKey = key === 'shift';
            this.keymap[key]?.(isShiftKey);
        });

        window.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();
            if (key === 'shift') {
                this.keymap[key](false);
            }
        });

        const hasTouchEvent = 'ontouchstart' in document.documentElement;
        const hasTouchPoints = window.navigator.maxTouchPoints >= 1;
        const isTouch = hasTouchEvent || hasTouchPoints;
        const eventName = isTouch ? 'touchstart' : 'mousedown';

        window.addEventListener(
            eventName,
            (e) => {
                this.handleClick(isTouch ? e.changedTouches[0] : e);
            },
            false,
        );
    }

    filterSelectableObjects(scene) {
        return scene.children
            .filter(({ type }) => !this.excludeTypes.includes(type))
            .filter(({ children }) => children.every((c) => c.type !== 'Line'))
            .filter(({ name }) => name !== 'transform-controls');
    }

    handleClick(e) {
        if (!this.controls.enabled || !this.controls.isShiftPressed) {
            return;
        }

        this.pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
        this.raycaster.setFromCamera(this.pointer, this.camera);

        const [firstIntersect] = this.raycaster.intersectObjects(
            this.selectable,
            true,
        );

        if (firstIntersect && firstIntersect.object !== this.intersected) {
            this.intersected = firstIntersect.object;
        }

        this.controls.attach(this.intersected);
        this.onActionComplete?.(this.intersected);
    }

    attach(target) {
        if (this.controls?.enabled) {
            this.controls.attach(target);
        }
    }

    toggle(status, context) {
        if (!this.controls) {
            this.action(context);
        }

        this.controls.enabled = status;
        this.controls.detach();
    }
}
