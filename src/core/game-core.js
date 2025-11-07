import { Clock } from 'three';
import { throttleTrailing } from '../helpers/utils/throttle';
import { gameSettings } from '../models/game-settings';
import { Camera } from './camera';
import { InputSystem } from './input/input';
import { Physics } from './physics';
import { Renderer } from './renderer';
import { Scene } from './scene';

class GameCore {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.physics = null;
        this.input = null;
        this.clock = new Clock();
        this.onUpdateCallbacks = [];
    }

    init(width = 960, height = 960) {
        const { scene, camera, renderer, physics } = gameSettings;

        this.scene = new Scene(scene);
        this.camera = new Camera(camera, this.scene);
        this.renderer = new Renderer({ ...renderer, width, height });
        this.physics = new Physics(physics, this.scene);
        this.input = new InputSystem(this.renderer.domElement);

        this.renderer.setAnimationLoop(this.update.bind(this));
        this.resize(width, height);
        this.input.init();

        const throttledResizeHandler = throttleTrailing(() => {
            this.resize(window.innerWidth, window.innerHeight);
        }, 1000);

        window.addEventListener('resize', throttledResizeHandler);
    }

    onUpdate(callback) {
        this.onUpdateCallbacks.push(callback);
    }

    resize(width, height) {
        this.camera.resize(width, height);
        this.renderer.resize(width, height);
    }

    update(time) {
        this.physics.update(time);
        this.renderer.render(this.scene, this.camera);

        for (const fn of this.onUpdateCallbacks) {
            fn(time, this.clock.getDelta());
        }
    }

    enableShadows() {}
}

export const core = new GameCore();
