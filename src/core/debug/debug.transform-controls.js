/* eslint-disable quote-props */
/* eslint-disable no-multi-assign */
/* eslint-disable max-len */

import { TransformControls } from 'three/addons/controls/TransformControls';

export class DebugTransformControls {
    constructor(onActionComplete) {
        this.controls = null;
        this.actions = {};
        this.keymap = {};
        this.onActionComplete = onActionComplete;
    }

    initActionsList() {
        this.actions = {
            translate: () => this.controls.setMode('translate'),
            rotate: () => this.controls.setMode('rotate'),
            scale: () => this.controls.setMode('scale'),
            xAxis: () => {
                this.controls.showX = true;
                this.controls.showY = this.controls.showZ = (this.controls.showY ^ this.controls.showZ) ? false : !this.controls.showZ;
            },
            yAxis: () => {
                this.controls.showY = true;
                this.controls.showX = this.controls.showZ = (this.controls.showX ^ this.controls.showZ) ? false : !this.controls.showZ;
            },
            zAxis: () => {
                this.controls.showZ = true;
                this.controls.showX = this.controls.showY = (this.controls.showX ^ this.controls.showY) ? false : !this.controls.showY;
            },
            selectMode: (status = true) => {
                this.controls.isShiftPressed = status;
            },
            snap: () => {
                if (!this.controls.translationSnap) {
                    this.controls.setTranslationSnap(1);
                    this.controls.setRotationSnap(15 * (Math.PI / 180));
                } else {
                    this.controls.setTranslationSnap(null);
                    this.controls.setRotationSnap(null);
                }
            },
            worldLocalSpace: () => {
                this.controls.setSpace(this.controls.space === 'local' ? 'world' : 'local');
            },
            toggle: () => {
                this.controls.enabled = !this.controls.enabled;
            },
            reset: () => {
                this.controls.detach();
                this.controls.showX = this.controls.showY = this.controls.showZ = true;
            },
            controlsSizeBigger: () => {
                this.controls.setSize(this.controls.size + 0.1);
            },
            controlsSizeSmaller: () => {
                this.controls.setSize(Math.max(this.controls.size - 0.1, 0.1));
            },
        };
    }

    initKeymap() {
        const { actions } = this;
        this.keymap = {
            x: () => actions.xAxis(),
            y: () => actions.yAxis(),
            z: () => actions.zAxis(),
            w: () => actions.translate(),
            g: () => actions.translate(),
            r: () => actions.rotate(),
            s: () => actions.scale(),
            q: () => actions.worldLocalSpace(),
            spacebar: () => actions.toggle(),
            shift: (s) => actions.selectMode(s),
            control: () => actions.snap(),
            escape: () => actions.reset(),
            '+': () => actions.controlsSizeBigger(),
            '=': () => actions.controlsSizeBigger(),
            '-': () => actions.controlsSizeSmaller(),
            '_': () => actions.controlsSizeSmaller(),
        };
    }

    action(context) {
        this.controls = new TransformControls(context.camera, context.renderer.domElement);
        this.controls.name = 'transform-controls';
        // context.scene.add(this.controls);

        this.controls.domElement.addEventListener('mouseUp', () => {
            if (this.onActionComplete) {
                this.onActionComplete(this.controls.object);
            }
        });

        this.controls.domElement.addEventListener('dragging-changed', (event) => {
            if (context.controls.orbit && context.controls.orbit.controls) {
                context.controls.orbit.controls.enabled = !event.value;
            }
        });

        context.scene.add(this.controls.getHelper());

        this.initActionsList();
        this.initKeymap();
        this.bindEvents();
    }

    toggle(status, context) {
        if (!this.controls) {
            this.action(context);
        }
    }

    bindEvents() {
        window.addEventListener('keydown', (event) => {
            let key = event.key.toLowerCase();
            const param = key === 'shift';

            if (key === ' ') {
                key = 'spacebar';
            }

            if (this.keymap[key]) {
                this.keymap[key](param);
            }
        });

        window.addEventListener('keyup', (event) => {
            const key = event.key.toLowerCase();

            if (this.keymap[key] === 'shift') {
                this.keymap[key](false);
            }
        });
    }
}
