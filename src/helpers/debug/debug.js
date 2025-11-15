import { DebugGUI } from './debug.gui.js';
import { DebugOrbitControls } from './debug.orbit-controls.js';
import { DebugPhysics } from './debug.physics.js';
import { DebugScene } from './debug.scene.js';
import { DebugShowSceneObjectProps } from './debug.show-scene-object-props.js';
import { DebugTransformControls } from './debug.transform-controls.js';

class Debug {
    constructor() {
        this.defaultOptions = {
            scene: false,
            props: false,
            transform: false,
            orbit: false,
            physics: false,
        };
        this.controls = {};
    }

    init({ scene, renderer, camera, physics }, props = {}) {
        // TODO implement re-init
        if (this.debugPanel) {
            return;
        }

        // Do nothing if no debug options provided
        if (!props || Object.keys(props).length === 0) {
            return;
        }

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.physics = physics;

        const guiOptions = { ...this.defaultOptions, ...props };
        const guiOptionKeys = Object.keys(guiOptions);

        this.controls = {
            props: new DebugShowSceneObjectProps(),
            orbit: new DebugOrbitControls(),
            physics: new DebugPhysics(),
            scene: new DebugScene((target) => {
                this.controls.objectProps.action(this, target);
                this.controls.transform?.attach(target);
                this.logObject(target);
            }),
            transform: new DebugTransformControls((target) => {
                this.controls.objectProps.action(this, target);
                this.logObject(target);
            }),
        };

        this.debugPanel = new DebugGUI(guiOptions, this.controls, this);

        for (const key of guiOptionKeys) {
            if (guiOptions[key] === true) {
                this.controls[key].action(this);
            }
        }

        // hide the scene tree if user dont want it to be shown
        if (!props.scene) {
            this.controls.scene.toggle(false, this);
        }

        if (guiOptionKeys.length) {
            this.debugPanel.init(guiOptions);
        }
    }

    logObject(target) {
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
