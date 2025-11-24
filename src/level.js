import { core } from '@alexfdr/three-game-core';
import { Object3D } from 'three';
import { Background } from './components/background';
import { Characters } from './components/characters';
import { Controls } from './components/controls';
import { CameraHelper } from './components/helpers/camera-helper';
import { OutlineHelper } from './components/helpers/outline-helper';
import { OverlayHelper } from './components/helpers/overlay-helper';
import { ShadowsHelper } from './components/helpers/shadows-helper';
import { DragHandler } from './components/input/drag-handler';
import { LevelLayout } from './components/level-layout';
import { Signal } from './helpers/signal';
import { pixiUI } from './ui/pixi-ui';
import { config } from './data/config';
import {
    ROLE_HIDER,
    ROLE_SEEKER,
    STATUS_PLAYER_LOSE,
    STATUS_PLAYER_WIN,
} from './data/game-const';
import { tweens } from './systems/tweens';

class LevelInstance {
    constructor() {
        this.status = {
            timerStarted: false,
            activateEnemies: false,
            firstInteraction: false,
            levelComplete: false,
        };

        this.onFirstInteraction = new Signal();
    }

    init(data) {
        this.ui = pixiUI.screens.get('ui');
        this.tutorial = pixiUI.screens.get('tutorial');
        this.hint = pixiUI.screens.get('hint');

        this.addGroup();
        this.addLayout();
        this.addCharacters(data);
        this.addCameraHelper();
        this.addBackground();
        this.addControls();
        this.addOutlineHelper(data);
        this.addOverlayHelper();

        this.setupGameFlow(data);
        this.setupInput();
        this.enableShadows();
        this.start();
    }

    addGroup() {
        this.group = new Object3D();
        this.group.name = 'level-root';
        core.scene.add(this.group);
    }

    addLayout() {
        this.layout = new LevelLayout({
            parent: this.group,
        });
    }

    addCharacters(data) {
        const { player, enemies, aiSeeker } = data;
        this.characters = new Characters({
            parent: this.group,
            data: {
                player,
                enemies,
                aiSeeker,
            },
        });
    }

    addCameraHelper() {
        this.cameraHelper = new CameraHelper();
    }

    addBackground() {
        this.background = new Background({
            image: config.background,
        });
    }

    addControls() {
        const { mesh, body } = this.characters.getPlayerMeshAndBody();
        this.controls = new Controls({ mesh, body });
    }

    addOutlineHelper(data) {
        const outlinedObjects = [];

        if (config.playerOutline) {
            outlinedObjects.push(this.characters.player.getSkinnedMesh());
        }

        for (let i = 0; i < data.enemies.length; i++) {
            const key = `enemy${i + 1}`;
            const enabledChar = config[`${key}Enabled`];
            const enabledOutline = config[`${key}Outline`];

            if (enabledChar && enabledOutline) {
                const enemy = this.characters.enemies.getEnemyByIndex(i);
                outlinedObjects.push(enemy.getSkinnedMesh());
            }
        }

        if (this.characters.aiSeeker && config.aiSeekerOutline) {
            outlinedObjects.push(this.characters.aiSeeker.getSkinnedMesh());
        }

        this.outlineHelper = new OutlineHelper({ color: config.outlineColor });
        this.outlineHelper.setOutlinedObjects(outlinedObjects);
    }

    addOverlayHelper() {
        if (!config.overlayEnabled) {
            return;
        }

        const { player, aiSeeker, enemies } = this.characters;
        const frontObjects = [player.getSkinnedMesh()];

        if (config.playerRole === ROLE_SEEKER) {
            frontObjects.push(...enemies.getAllSkinnedMeshes());
        } else if (config.playerRole === ROLE_HIDER) {
            frontObjects.push(aiSeeker.getSkinnedMesh());
        }

        this.overlayHelper = new OverlayHelper({ frontObjects });
    }

    setupGameFlow() {
        this.onFirstInteraction.addOnce(() => {
            this.characters.aiSeeker?.activate();
            this.tutorial.hide();
            this.overlayHelper?.hide();

            if (config.timerStartAfterInteraction) {
                this.startTimer();
            }

            if (config.timerAppearAfterInteraction) {
                this.ui.show();
            }
        });

        this.ui.timer.onComplete.addOnce(() => {
            if (config.playerRole === ROLE_SEEKER) {
                this.handleLose();
            } else if (config.playerRole === ROLE_HIDER) {
                this.handleWin();
            }
        });

        this.characters.enemies.onCatchAllEnemies.addOnce((status) => {
            if (status === STATUS_PLAYER_WIN) {
                this.handleWin();
            } else if (status === STATUS_PLAYER_LOSE) {
                this.handleLose();
            }
        });

        this.characters.player.onCatchBySeeker.addOnce(() => {
            this.handleLose();
        });
    }

    setupInput() {
        core.input.setHandler(new DragHandler());
        core.input.onDown((data) => this.handleOnDown(data));
        core.input.onMove((data) => this.handleOnMove(data));
        core.input.onUp((data) => this.handleOnUp(data));
    }

    enableShadows() {
        this.shadowHelper = new ShadowsHelper(core.renderer, core.scene);
    }

    start() {
        this.characters.enemies.activate();
        // this.characters.aiSeeker?.activate();
        this.overlayHelper?.show();

        this.tutorial.show();
        this.hint.show();

        if (!config.timerStartAfterInteraction) {
            this.startTimer();
        }
        if (!config.timerAppearAfterInteraction) {
            this.ui.show();
        }
    }

    handleOnDown() {
        if (!this.status.firstInteraction) {
            this.status.firstInteraction = true;
            this.onFirstInteraction.dispatch();
        }

        this.hint.hide();
        this.characters.player.startMoving();
    }

    handleOnMove(data) {
        this.controls.rotateAndMoveForward(data);
    }

    handleOnUp() {
        this.characters.player.stopMoving();
        this.hint.sheduleNextShow();
    }

    startTimer() {
        if (this.status.timerStarted) {
            return;
        }

        this.status.timerStarted = true;
        tweens.wait(500).then(() => this.ui.timer.start());
    }

    handleWin() {
        core.input.enabled = false;
        this.status.levelComplete = true;
        this.ui.timer.stop();
        this.ui.hide();
        this.hint.hide(true);
        this.characters.player.finalDance();
        this.characters.enemies.deactivate();
        this.characters.aiSeeker?.deactivate();
        this.cameraHelper.focusOnPlayer(this.characters.player);
        this.overlayHelper?.hide();
        pixiUI.screens.get('win').show();
    }

    handleLose() {
        core.input.enabled = false;
        this.status.levelComplete = true;
        this.ui.timer.stop();
        this.ui.hide();
        this.hint.hide(true);
        this.characters.player.finalLose();
        this.characters.enemies.deactivate();
        this.characters.aiSeeker?.deactivate();
        this.cameraHelper.focusOnPlayer(this.characters.player);
        this.overlayHelper?.hide();
        pixiUI.screens.get('lose').show();
    }

    render() {
        this.outlineHelper?.render();
        this.overlayHelper?.render();
    }

    update(dt) {
        if (this.status.levelComplete) {
            // this.outlineHelper.update();
            return;
        }

        if (!this.characters.player.status.caught) {
            this.controls.update();
        }

        this.cameraHelper.update(this.characters.player);
        this.characters.update(
            this.layout.walls,
            dt,
            this.status.firstInteraction,
        );
    }

    remove() {}
}

export const level = new LevelInstance();
