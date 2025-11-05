// import threeScene from '@components/three-scene'

import { Object3D } from 'three';
import { Background } from './components/background';
import { Characters } from './components/characters';
import { Controls } from './components/controls';
import { gameTimer } from './components/game-timer';
import { CameraHelper } from './components/helpers/camera-helper';
import { OutlineHelper } from './components/helpers/outline-helper';
import { OverlayHelper } from './components/helpers/overlay-helper';
import { sqHelper } from './components/helpers/sq-helper';
import { LevelLayout } from './components/level-layout';
import { core } from './core/game-core';
import { DragHandler } from './core/input/handlers/drag-handler';
import { input } from './core/input/input';
import config from './assets/settings/config';
import { ROLE_HIDER, ROLE_SEEKER } from './models/game-const';

export class LevelInstance {
    constructor() {
        this.group = new Object3D();
        this.group.name = 'level';

        this.status = {
            timerStarted: false,
            activateEnemies: false,
            firstInteractionComplete: false,
        };
    }

    init(data) {
        core.scene.add(this.group);

        this.addLayout();
        this.addCharacters(data);
        this.addCameraHelper();
        this.addBackground();
        this.addControls();
        this.addOutlineHelper(data);
        this.addOverlayHelper();

        this.setupGameFlow(data);
        this.setupInput();
        this.start();
    }

    addLayout() {
        this.layout = new LevelLayout();
        this.layout.init(this.group);
    }

    addCharacters(data) {
        const { player, enemies, aiSeeker } = data;
        this.characters = new Characters();
        this.characters.init(this.group, player, enemies, aiSeeker);
    }

    addCameraHelper() {
        this.cameraHelper = new CameraHelper();
        this.cameraHelper.init();
    }

    addBackground() {
        this.background = new Background();
        this.background.init({ image: config.game.background.value });
    }

    addControls() {
        const [playerMesh, playerBody] = this.characters.getPlayerMeshAndBody();
        this.controls = new Controls();
        this.controls.init(playerMesh, playerBody);
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

        if (this.characters.aiSeeker) {
            if (config.aiSeeker.outline.value) {
                outlinedObjects.push(this.characters.aiSeeker.getSkinnedMesh());
            }
        }

        const color = config.game.outlineColor.value;

        this.outlineHelper = new OutlineHelper();
        this.outlineHelper.init({ color });
        this.outlineHelper.setOutlinedObjects(outlinedObjects);
    }

    addOverlayHelper() {
        if (!config.overlay.enabled.value) {
            return;
        }

        const role = config.player.role.value;
        const { player, aiSeeker, enemies } = this.characters;
        const frontObjects = [player.getSkinnedMesh()];

        if (role === ROLE_SEEKER) {
            frontObjects.push(...enemies.getAllSkinnedMeshes());
        } else if (role === ROLE_HIDER) {
            frontObjects.push(aiSeeker.getSkinnedMesh());
        }

        this.overlayHelper = new OverlayHelper();
        this.overlayHelper.init(frontObjects);
    }

    setupGameFlow() {
        // screens.ui.timer.onComplete.addOnce(() => {
        //     const role = config.player.role.value;

        //     if (role === 'seeker') {
        //         sqHelper.levelLose();
        //     } else if (role === 'hider') {
        //         sqHelper.levelWin();
        //     }
        // });

        sqHelper.onWin.addOnce(() => {
            // screens.ui.timer.stop();
            // screens.ui.hide();
            this.characters.player.finalDance();
            this.characters.enemies.deactivate();
            this.characters.aiSeeker?.deactivate();
            this.cameraHelper.focusOnPlayer(this.characters.player);
            this.overlayHelper?.hide();
        });

        sqHelper.onLose.addOnce(() => {
            // screens.ui.hide();
            // screens.ui.timer.stop();
            this.characters.player.finalLose();
            this.characters.enemies.deactivate();
            this.characters.aiSeeker?.deactivate();
            this.cameraHelper.focusOnPlayer(this.characters.player);
            this.overlayHelper?.hide();
        });

        if (config.timer.startFrom.value === 'game') {
            this.startTimer();
        }

        if (config.timer.appear.value === 'game') {
            // screens.ui.show();
        }
    }

    setupInput() {
        // const input = inputFactory.create('joystick');
        input.setHandler(new DragHandler());
        input.onDown((data) => this.handleOnDown(data));
        input.onMove((data) => this.handleOnMove(data));
        input.onUp((data) => this.handleOnUp(data));
    }

    start() {
        this.characters.enemies.activate();
        this.characters.aiSeeker?.activate();
        this.overlayHelper?.show();
    }

    handleOnDown() {
        // GM.trigger.interactionStart();

        if (!this.status.firstInteractionComplete) {
            this.status.firstInteractionComplete = true;
            // screens.tutorial.hide();

            if (this.characters.aiSeeker) {
                this.characters.aiSeeker.activate();
            }
        }

        if (config.timer.startFrom.value === 'interaction') {
            this.startTimer();
        }

        this.overlayHelper?.hide();

        this.characters.player.startMoving();
    }

    handleOnMove(data) {
        this.controls.rotateAndMoveForward(data);
    }

    handleOnUp() {
        this.characters.player.stopMoving();
        // GM.trigger.interactionComplete();
    }

    startTimer() {
        if (this.status.timerStarted) {
            return;
        }

        this.status.timerStarted = true;
        // screens.ui.show();
        // setTimeout(() => screens.ui.timer.start(), 500);
    }

    update(dt) {
        // if (sqHelper.levelComplete) {
        //     this.outlineHelper.update();
        //     return;
        // }

        if (!this.characters.player.status.caught) {
            this.controls.update();
        }

        this.cameraHelper.update(this.characters.player);
        this.characters.update(
            this.layout.walls,
            dt,
            this.status.firstInteractionComplete,
        );
        this.overlayHelper?.update();
        this.outlineHelper?.update();
        // gameTimer.update();
    }

    remove() {}
}
