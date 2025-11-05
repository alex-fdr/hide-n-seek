import { Clock } from 'three';
import { gameSettings } from '../models/game-settings';
import { Camera } from './camera';
import { Physics } from './physics';
import { Renderer } from './renderer';
import { Scene } from './scene';
import { Screens } from './screens';

class GameCore {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.physics = null;
        this.screens = null;
        this.clock = new Clock();
        this.updateableList = [];
    }

    init(props = {}) {
        const { width = 960, height = 960 } = props;

        this.scene = new Scene(gameSettings.scene);
        this.camera = new Camera(gameSettings.camera, this.scene);
        this.renderer = new Renderer({
            ...gameSettings.renderer,
            width,
            height,
        });
        this.physics = new Physics(gameSettings.physics, this.scene);
        this.screens = new Screens();

        this.resize(width, height);
        this.renderer.setAnimationLoop(this.update.bind(this));

        window.addEventListener('resize', () => {
            this.resize(window.innerWidth, window.innerHeight);
        });
    }

    resize(width, height) {
        this.camera.resize(width, height);
        this.renderer.resize(width, height);
    }

    update(time) {
        this.physics.update(time);
        this.renderer.render(this.scene, this.camera);

        for (const entity of this.updateableList) {
            entity.update(time, this.clock.getDelta());
        }
    }
}

export const core = new GameCore();
