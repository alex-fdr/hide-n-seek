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
        this.guiOptions = {
            select: true,
            transform: true,
            objectProps: true,
            scene: false,
            orbit: false,
            physics: false,
        };
    }

    init({ scene, renderer, camera, physics }, props = {}) {
        // TODO implement re-init
        if (this.debugPanel) {
            return;
        }

        // Do nothing if no debug options were provided
        if (!props || Object.keys(props).length === 0) {
            return;
        }

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.physics = physics;

        const options = { ...this.guiOptions, ...props };
        const optionKeys = Object.keys(options);

        this.scenePanel = this.createScenePanel();
        this.controls = {
            scene: new DebugScene(this.scenePanel, (t) => this.onAction('scene', t)),
            orbit: new DebugOrbitControls(),
            physics: new DebugPhysics(),
            transform: new DebugTransformControls((t) => this.onAction('transform', t)),
            select: new DebugSelectObject((t) => this.onAction('select', t)),
            objectProps: new DebugShowSceneObjectProps(this.scenePanel),
        };
        this.debugPanel = new DebugGUI(options, this.controls, this);

        for (const key of optionKeys) {
            if (options[key] === true) {
                this.controls[key]?.action(this);
            }
        }

        // hide the scene tree if user dont want it to be shown
        if (!props.scene) {
            this.controls.scene.toggle(false, this);
        }

        if (optionKeys.length) {
            this.debugPanel.init(options);
        }
    }

    createScenePanel() {
        const panel = new GUI({
            title: 'Scene Controls',
            width: 200,
        });
        const el = panel.domElement;
        el.style.right = 0;
        return panel;
    }

    onAction(type, target) {
        const { transform, objectProps } = this.controls;

        if (type !== 'transform') {
            if (transform?.controls?.enabled) {
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
