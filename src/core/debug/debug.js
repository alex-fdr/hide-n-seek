/* eslint-disable no-console */
import GUI from 'lil-gui';
import { DebugGUI } from './debug.gui.js';
import { DebugOrbitControls } from './debug.orbit-controls.js';
import { DebugPhysics } from './debug.physics.js';
import { DebugScene } from './debug.scene.js';
import { DebugSelectObject } from './debug.select-object.js';
import { DebugShowSceneObjectProps } from './debug.show-scene-object-props.js';
import { DebugTransformControls } from './debug.transform-controls.js';

class Debug {
    constructor() {
        this.defaultOptions = {
            select: true,
            transform: true,
            objectProps: false,
            scene: false,
            orbit: false,
        };

        this.guiOptions = {
            scene: false,
            orbit: false,
            physics: false,
        };

        this.scene = null;
        this.renderer = null;
        this.camera = null;
        this.physics = null;
    }

    init({ scene, renderer, camera, physics }, props = {}) {
        // TODO implement re-init
        if (this.gui) {
            return;
        }

        // Do nothing if no debug options are provided
        if (!props || Object.keys(props).length === 0) {
            return;
        }

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.physics = physics;

        this.panel = this.createRightSidePanel();
        this.controls = this.getControls();
        this.gui = new DebugGUI(this.getGuiOptions(props), this.controls, this);

        const options = { ...this.defaultOptions, ...props };
        const keys = Object.keys(options);

        keys.filter((key) => options[key] && this.controls[key]?.action).forEach((key) => {
            this.controls[key].action(this);
        });

        // hide the scene tree if user dont want it to be shown
        if (!props.scene) {
            this.controls.scene.toggle(false, this);
        }

        if (keys.length) {
            this.gui.init(options);
        }
    }

    createRightSidePanel() {
        const panel = new GUI({
            name: 'panel',
            closeOnTop: true,
            width: 200,
        });
        const el = panel.domElement;
        el.parentElement.style.zIndex = 99;
        el.style.zIndex = 10;
        el.style.marginRight = 0;
        return panel;
    }

    getControls() {
        return {
            scene: new DebugScene(this.panel, (t) => this.onAction('scene', t)),
            orbit: new DebugOrbitControls(),
            physics: new DebugPhysics(),
            transform: new DebugTransformControls((t) => this.onAction('transform', t)),
            select: new DebugSelectObject((t) => this.onAction('select', t)),
            objectProps: new DebugShowSceneObjectProps(this.panel),
        };
    }

    getGuiOptions(props) {
        const guiOptions = {};
        Object.keys(this.guiOptions).forEach((key) => {
            if (props[key] === true || props[key] === false) {
                guiOptions[key] = props[key];
            } else {
                guiOptions[key] = this.guiOptions[key];
            }
        });
        return guiOptions;
    }

    onAction(type, target) {
        const { transform, objectProps } = this.controls;

        if (type !== 'transform') {
            if (transform?.controls) {
                if (type === 'scene') {
                    transform.controls.attach(target);
                }

                if (type === 'select' && target && transform.controls.isShiftPressed) {
                    transform.controls.attach(target);
                }
            }

            objectProps.action(this, target);
        }

        this.log(target);
    }

    log(target) {
        if (!target) return;

        console.log('\n');
        console.log('target:   ', target);
        console.log('position: ', target.position);
        console.log('rotation: ', target.rotation);
        console.log('scale:    ', target.scale);
    }

    update(dt) {
        this.controls.physics.update(dt);
    }
}

export const debug = new Debug();
