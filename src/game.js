// import screenManager from '@components/screen';
// import tweenManager from '@components/tween';
// import threeAssets from '@components/three-assets';
// import threeScene from '@components/three-scene';

// import { animationManager } from './helpers/animations';
// import { gameSettings } from './models/game-settings';
// import { levelMediator } from './level-mediator';

// import { sqHelper } from './components/helpers/sq-helper';
// import { tweens } from './helpers/tweens';

import { assets } from './core/assets';
import { debug } from './core/debug/debug';
import { core } from './core/game-core';
import { input } from './core/input/input';

import { animationManager } from './helpers/animations';
import { tweens } from './helpers/tweens';
import { enableShadows } from './helpers/utils/enable-shadows';

import modelAnimationDance from './assets/models/animation-dance.glb';
import modelAnimationRun from './assets/models/animation-run.glb';
import modelAnimationSad from './assets/models/animation-sad.glb';
import modelCage from './assets/models/cage.glb';
import modelCharacterIdle from './assets/models/character-idle.glb';
import modelLevel from './assets/models/level.glb';
import modelTigerIdle from './assets/models/tiger-idle.glb';

import { LevelInstance } from './level-instance';
import { level1 } from './models/levels/level1';

export class Game {
    constructor({ width = 960, height = 960 } = {}) {
        core.init({ width, height });
        input.init(core.renderer.domElement);

        core.screens.add('loading');

        this.level = new LevelInstance();
    }

    async load() {
        await assets.load({
            models: [
                { key: 'level', file: modelLevel },
                { key: 'cage', file: modelCage },
                { key: 'character-idle', file: modelCharacterIdle },
                { key: 'tiger-idle', file: modelTigerIdle },
                { key: 'animation-dance', file: modelAnimationDance },
                { key: 'animation-run', file: modelAnimationRun },
                { key: 'animation-sad', file: modelAnimationSad },
            ],
            textures: [],
        });

        this.level.init(level1);

        core.camera.lookAt(0, 0, 0);
        core.screens.hide('loading');

        core.updateableList.push(this);

        debug.init(core, {
            orbit: false,
            scene: false,
            physics: false,
        });

        // input.enabled = false;

        debug.gui.addCustomControl(
            'user input',
            (status) => {
                input.enabled = status;
            },
            input.enabled,
        );

        enableShadows(core.renderer, core.scene);
    }

    update(time, dt) {
        animationManager.update(dt);
        tweens.update(time);
        this.level.update(dt);
        debug.update(dt);
    }
}
