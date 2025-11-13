import { TransformControls } from 'three/addons/controls/TransformControls';

export class DebugTransformControls {
    constructor(onActionComplete) {
        this.controls = null;
        this.actions = {};
        this.keymap = {};
        this.onActionComplete = onActionComplete;
    }

    action(context) {
        this.controls = new TransformControls(context.camera, context.renderer.domElement);
        this.controls.name = 'transform-controls';

        this.controls.addEventListener('mouseUp', () => {
            if (this.onActionComplete) {
                this.onActionComplete(this.controls.object);
            }
        });

        this.controls.addEventListener('dragging-changed', (event) => {
            if (context.controls.orbit?.controls) {
                context.controls.orbit.controls.enabled = !event.value;
            }
        });

        context.scene.add(this.controls.getHelper());

        this.actions = this.initActionsList(this.controls);
        this.keymap = this.initKeymap(this.actions);

        this.bindEvents();
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
            toggle: () => {
                ctrl.enabled = !ctrl.enabled;
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
            // spacebar: () => actions.toggle(),
            shift: (s) => actions.selectMode(s),
            control: () => actions.snap(),
            escape: () => actions.reset(),
            '+': () => actions.controlsSizeBigger(),
            '=': () => actions.controlsSizeBigger(),
            '-': () => actions.controlsSizeSmaller(),
            '_': () => actions.controlsSizeSmaller(),
        };
    }

    bindEvents() {
        window.addEventListener('keydown', (event) => {
            let key = event.key.toLowerCase();
            const isShiftKey = key === 'shift';

            if (key === ' ') {
                key = 'spacebar';
            }

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
