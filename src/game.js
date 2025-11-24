import { debug } from '@alexfdr/three-debug-gui';
import { assets, core } from '@alexfdr/three-game-core';
import { Assets as PixiAssets } from 'pixi.js';
import { level } from './level';
import { DebugPhysics } from './helpers/debug-physics';
import { pixiUI } from './ui/pixi-ui';
import { HintScreen } from './ui/screens/hint';
import { LoseScreen } from './ui/screens/lose';
import { TutorialScreen } from './ui/screens/tutorial';
import { UIScreen } from './ui/screens/ui';
import { WinScreen } from './ui/screens/win';
import { gameSettings } from './data/game-settings';
import { level1 as level1Data } from './data/levels/level1';
import { animations } from './systems/animations';
// import { debug } from './helpers/debug/debug';
import { htmlScreens } from './systems/html-screens';
import { tweens } from './systems/tweens';

// 3d models and textures
import modelAnimationDance from './assets/models/animation-dance.glb';
import modelAnimationRun from './assets/models/animation-run.glb';
import modelAnimationSad from './assets/models/animation-sad.glb';
import modelCage from './assets/models/cage.glb';
import modelCharacterIdle from './assets/models/character-idle.glb';
import modelLevel from './assets/models/level.glb';
import modelTigerIdle from './assets/models/tiger-idle.glb';

// pixi.js images and fonts
import gamefont from './assets/fonts/gamefont.woff';
import button from './assets/images/button.png';
import dummyWhite from './assets/images/dummy-white.png';
import infinitySign from './assets/images/infinity-sign.png';
import pointer from './assets/images/pointer.png';
import timerBg from './assets/images/timer-bg.png';

export class Game {
    constructor() {
        this.running = true;
        htmlScreens.add('loading');
    }

    async start({ width, height }) {
        core.init(width, height, gameSettings);

        // load three.js assets
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

        await pixiUI.init(core.renderer, width, height);

        // load pixi assets
        await PixiAssets.load([
            { alias: 'infinity-sign', src: infinitySign },
            { alias: 'pointer', src: pointer },
            { alias: 'dummy-white', src: dummyWhite },
            { alias: 'button', src: button },
            { alias: 'timer-bg', src: timerBg },
            { alias: 'gamefont', src: gamefont },
        ]);

        const screenProps = { parent: pixiUI.stage, visible: false };
        pixiUI.screens.set('tutorial', new TutorialScreen(screenProps));
        pixiUI.screens.set('hint', new HintScreen(screenProps));
        pixiUI.screens.set('lose', new LoseScreen(screenProps));
        pixiUI.screens.set('win', new WinScreen(screenProps));
        pixiUI.screens.set('ui', new UIScreen(screenProps));

        level.init(level1Data);

        debug.init({
            scene: core.scene,
            canvas: core.renderer.domElement,
            camera: core.camera,
            props: { scene: true },
        });

        this.resize(width, height);
        this.setupCustomDebugControls();
        htmlScreens.hide('loading');

        core.onUpdate(this.update.bind(this));
        core.onResize(this.resize.bind(this));
    }

    setupCustomDebugControls() {
        debug.registerComponent({
            label: 'physics',
            initialValue: false,
            instance: new DebugPhysics({
                scene: core.scene,
                world: core.physics.world,
            }),
        });

        debug.registerComponent({
            label: 'user input',
            initialValue: core.input.enabled,
            instance: {
                toggle: (value) => {
                    core.input.enabled = value;
                },
            },
        });

        debug.registerComponent({
            label: 'game loop',
            initialValue: this.running,
            instance: {
                toggle: (value) => {
                    this.running = value;
                },
            },
        });

        for (const enemy of level.characters.enemies.getAll()) {
            const { name, pathFollower } = enemy;

            debug.registerComponent({
                label: `path-${name}`,
                initialValue: false,
                instance: {
                    toggle: (status) => {
                        if (!pathFollower.pathMesh) {
                            pathFollower.renderPath();
                        }

                        if (!pathFollower.pathPoints) {
                            pathFollower.renderPoints();
                        }

                        pathFollower.pathMesh.visible = status;
                        pathFollower.pathPoints.visible = status;
                    },
                },
            });
        }
    }

    resize(width, height) {
        pixiUI.resize(width, height);
    }

    update(time, deltaTime) {
        if (!this.running) {
            return;
        }

        core.render();
        level.render();
        pixiUI.render();

        animations.update(deltaTime);
        tweens.update(time);
        debug.update(deltaTime);
        level.update(deltaTime);
    }
}
