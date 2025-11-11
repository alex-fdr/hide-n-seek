import { core } from '@alexfdr/three-game-core';
import { Object3D } from 'three';
import { Background } from './components/background';
import { Characters } from './components/characters';
import { Controls } from './components/controls';
import { CameraHelper } from './components/helpers/camera-helper';
import { OutlineHelper } from './components/helpers/outline-helper';
import { OverlayHelper } from './components/helpers/overlay-helper';
import { ShadowsHelper } from './components/helpers/shadows-helper';
import { LevelLayout } from './components/level-layout';
import { DragHandler } from './helpers/drag-handler';
import { tweens } from './helpers/tweens';
import { pixiUI } from './ui/pixi-ui';
import config from './assets/settings/config';
import {
    ROLE_HIDER,
    ROLE_SEEKER,
    STATUS_PLAYER_LOSE,
    STATUS_PLAYER_WIN,
} from './data/game-const';

class LevelInstance {
    constructor() {
        this.status = {
            timerStarted: false,
            activateEnemies: false,
            firstInteraction: false,
            levelComplete: false,
        };
    }

    init(data) {
        this.ui = pixiUI.getScreen('ui');

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
        this.group.name = 'level';
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
            image: config.game.background.value,
        });
    }

    addControls() {
        const { mesh, body } = this.characters.getPlayerMeshAndBody();
        this.controls = new Controls({ mesh, body });
    }

    addOutlineHelper(data) {
        const outlinedObjects = [];

        if (config.player.outline.value) {
            outlinedObjects.push(this.characters.player.getSkinnedMesh());
        }

        for (let i = 0; i < data.enemies.length; i++) {
            const key = `enemy${i + 1}`;
            const enabledChar = config[key].enabled.value;
            const enabledOutline = config[key].outline.value;

            if (enabledChar && enabledOutline) {
                const enemy = this.characters.enemies.getEnemyByIndex(i);
                outlinedObjects.push(enemy.getSkinnedMesh());
            }
        }

        if (this.characters.aiSeeker && config.aiSeeker.outline.value) {
            outlinedObjects.push(this.characters.aiSeeker.getSkinnedMesh());
        }

        const color = config.game.outlineColor.value;

        this.outlineHelper = new OutlineHelper({ color });
        this.outlineHelper.setOutlinedObjects(outlinedObjects);
    }

    addOverlayHelper() {
        if (!config.overlay.enabled.value) {
            return;
        }

        const playerRole = config.player.role.value;
        const { player, aiSeeker, enemies } = this.characters;
        const frontObjects = [player.getSkinnedMesh()];

        if (playerRole === ROLE_SEEKER) {
            frontObjects.push(...enemies.getAllSkinnedMeshes());
        } else if (playerRole === ROLE_HIDER) {
            frontObjects.push(aiSeeker.getSkinnedMesh());
        }

        this.overlayHelper = new OverlayHelper({ frontObjects });
    }

    setupGameFlow() {
        this.ui.timer.onComplete.addOnce(() => {
            const playerRole = config.player.role.value;
            if (playerRole === ROLE_SEEKER) {
                this.handleLose();
            } else if (playerRole === ROLE_HIDER) {
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

        if (config.timer.startFrom.value === 'game') {
            this.startTimer();
        }
        if (config.timer.appear.value === 'game') {
            this.ui.show();
        }
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
        this.characters.aiSeeker?.activate();
        this.overlayHelper?.show();
    }

    handleOnDown() {
        if (!this.status.firstInteraction) {
            this.status.firstInteraction = true;
            this.characters.aiSeeker?.activate();
            pixiUI.hideScreen('tutorial')?.hide();

            if (config.timer.startFrom.value === 'interaction') {
                this.startTimer();
            }
        }

        this.overlayHelper?.hide();
        this.characters.player.startMoving();
    }

    handleOnMove(data) {
        this.controls.rotateAndMoveForward(data);
    }

    handleOnUp() {
        this.characters.player.stopMoving();
    }

    startTimer() {
        if (this.status.timerStarted) {
            return;
        }

        console.log('start timer', this.status);

        this.status.timerStarted = true;
        tweens.wait(500).then(() => this.ui.timer.start());
    }

    handleWin() {
        core.input.enabled = false;
        this.status.levelComplete = true;
        this.ui.timer.stop();
        this.ui.hide();
        this.characters.player.finalDance();
        this.characters.enemies.deactivate();
        this.characters.aiSeeker?.deactivate();
        this.cameraHelper.focusOnPlayer(this.characters.player);
        this.overlayHelper?.hide();
    }

    handleLose() {
        core.input.enabled = false;
        this.status.levelComplete = true;
        this.ui.timer.stop();
        this.ui.hide();
        this.characters.player.finalLose();
        this.characters.enemies.deactivate();
        this.characters.aiSeeker?.deactivate();
        this.cameraHelper.focusOnPlayer(this.characters.player);
        this.overlayHelper?.hide();
    }

    render() {
        this.outlineHelper?.render();
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
        this.overlayHelper?.update();
        this.characters.update(
            this.layout.walls,
            dt,
            this.status.firstInteraction,
        );
    }

    remove() {}
}

export const level = new LevelInstance();
