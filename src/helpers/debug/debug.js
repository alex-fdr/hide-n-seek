import GUI from 'lil-gui';
import { DebugObjectProps } from './debug-object-props.js';
import { DebugOrbitControls } from './debug-orbit-controls.js';
import { DebugPhysics } from './debug-physics.js';
import { DebugSceneTree } from './debug-scene-tree.js';
import { DebugTransform } from './debug-transform.js';

class Debug {
    constructor() {
        this.options = {
            scene: false,
            props: false,
            transform: false,
            orbit: false,
            physics: false,
        };
        this.components = {};
    }

    init({ scene, renderer, camera, physics }, props = {}) {
        if (this.panel) {
            return;
        }

        this.scene = scene;
        this.renderer = renderer;
        this.camera = camera;
        this.physics = physics;
        this.options = { ...this.options, ...props };

        this.panel = new GUI({ width: 100, title: 'Debug' });
        this.panel.domElement.setAttribute('id', 'debug-panel');

        this.components = {
            props: new DebugObjectProps(),
            orbit: new DebugOrbitControls(),
            physics: new DebugPhysics(),
            scene: new DebugSceneTree(this.onSceneAction.bind(this)),
            transform: new DebugTransform(this.onTransformAction.bind(this)),
        };

        for (const label of Object.keys(this.options)) {
            this.createToggle(label);

            // perform control's action if this option is enabled by default
            if (this.options[label]) {
                this.components[label]?.action(this);
            }
        }

        this.tweakPanelStyle();
    }

    tweakPanelStyle() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            #debug-panel {
                top: 0;
                left: 0;
            }
            #debug-panel .lil-controller > .lil-name {
                width: 80%;
            }
        `;
        document.head.appendChild(styleElement);
    }

    createToggle(label) {
        this.panel.add(this.options, label).onChange((value) => {
            this.options[label] = value;
            this.components[label]?.toggle(value, this);
        });
    }

    addCustomToggle({ label, initialValue, handler }) {
        if (Object.hasOwn(this.options, label)) {
            console.error(`a toggle with the name '${label}' already exists`);
            return;
        }

        this.options[label] = initialValue;
        this.components[label] = {
            toggle: (status) => handler(status),
        };

        this.createToggle(label);
    }

    onSceneAction(target) {
        this.components.props.action(this, target);
        this.components.transform.controls?.attach(target);
        this.logObject(target);
    }

    onTransformAction(target) {
        // show props panel for the selected object
        this.components.props.action(this, target);
        this.logObject(target);
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
        this.components.orbit.update();
        this.components.physics.update(dt);
    }
}

export const debug = new Debug();
