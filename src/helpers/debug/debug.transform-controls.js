import { TransformControls } from 'three/addons/controls/TransformControls';

export class DebugTransformControls {
    constructor(onActionComplete) {
        this.controls = null;
        this.actions = {};
        this.keymap = {};
        this.onActionComplete = onActionComplete;
    }

    action({ camera, renderer, scene, controls: { orbit } }) {
        this.controls = new TransformControls(camera, renderer.domElement);
        this.controls.name = 'transform-controls';
        scene.add(this.controls.getHelper());

        this.actions = this.initActionsList(this.controls);
        this.keymap = this.initKeymap(this.actions);

        this.bindEvents(orbit);
    }

    initActionsList(ctrl) {
        return {
            translate: () => ctrl.setMode('translate'),
            rotate: () => ctrl.setMode('rotate'),
            scale: () => ctrl.setMode('scale'),
            xAxis: () => {
                ctrl.showX = true;
                ctrl.showY = (ctrl.showY === ctrl.showZ) ? !ctrl.showY : false;
                ctrl.showZ = ctrl.showY;
            },
            yAxis: () => {
                ctrl.showX = (ctrl.showX === ctrl.showZ) ? !ctrl.showX : false;
                ctrl.showY = true;
                ctrl.showZ = ctrl.showX;
            },
            zAxis: () => {
                ctrl.showX = (ctrl.showX === ctrl.showY) ? !ctrl.showX : false;
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
                ctrl.setSpace((ctrl.space === 'local') ? 'world' : 'local');
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
            '_': () => actions.controlsSizeSmaller(),
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
    }

    toggle(status, context) {
        if (!this.controls) {
            this.action(context);
        }

        this.controls.enabled = status;
        this.controls.detach();
    }
}
