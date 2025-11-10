import { assets, core } from '@alexfdr/three-game-core';
import { debug } from './core/debug/debug';
import { screens } from './core/screens';
import { animations } from './helpers/animations';
import { tweens } from './helpers/tweens';
import { level } from './level';
import { gameSettings } from './models/game-settings';
import { level1 as level1Data } from './models/levels/level1';
import { pixiUI } from './ui/pixi-ui';
import { HintScreen } from './ui/screens/hint';
import { LoseScreen } from './ui/screens/lose';
import { TutorialScreen } from './ui/screens/tutorial';
import { UIScreen } from './ui/screens/ui';
import { WinScreen } from './ui/screens/win';
import modelAnimationDance from './assets/models/animation-dance.glb';
import modelAnimationRun from './assets/models/animation-run.glb';
import modelAnimationSad from './assets/models/animation-sad.glb';
import modelCage from './assets/models/cage.glb';
import modelCharacterIdle from './assets/models/character-idle.glb';
import modelLevel from './assets/models/level.glb';
import modelTigerIdle from './assets/models/tiger-idle.glb';

export class Game {
    constructor() {
        this.running = true;
        screens.add('loading');
    }

    async start({ width = 960, height = 960 }) {
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

        core.init(width, height, gameSettings);
        await pixiUI.init(core.renderer, width, height);
        level.init(level1Data);
        debug.init(core, {
            orbit: false,
            scene: false,
            physics: false,
        });

        core.onUpdate(this.update.bind(this));
        core.onResize(this.resize.bind(this));
        screens.hide('loading');

        this.addPixiScreens();
        // this.setupCustomDebugControls();

        this.resize(width, height);
    }

    addPixiScreens() {
        pixiUI.screens.add('tutorial', new TutorialScreen(false));
        pixiUI.screens.add('hint', new HintScreen(false));
        pixiUI.screens.add('lose', new LoseScreen(false));
        pixiUI.screens.add('win', new WinScreen(false));
        pixiUI.screens.add('ui', new UIScreen(false));

        pixiUI.screens.show('ui');
        pixiUI.screens.show('hint');
    }

    setupCustomDebugControls() {
        debug.gui.addCustomToggle('user input', core.input.enabled, (value) => {
            core.input.enabled = value;
        });

        debug.gui.addCustomToggle('game loop', this.running, (value) => {
            this.running = value;
        });

        for (const enemy of level.characters.enemies.getAll()) {
            const { pathFollower } = enemy;

            debug.gui.addCustomToggle(`path-${enemy.name}`, false, (status) => {
                if (pathFollower.pathMesh) {
                    pathFollower.pathMesh.visible = status;
                } else {
                    pathFollower.renderPath();
                }

                if (pathFollower.pointsGroup) {
                    pathFollower.pointsGroup.visible = status;
                } else {
                    pathFollower.renderPoints();
                }
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
