import { core } from '@alexfdr/three-game-core';
import { Object3D, Vector3 } from 'three';
import { tweens } from '../../helpers/tweens';
import config from '../../assets/settings/config';
import { CAMERA_SETTINGS } from '../../data/game-const';

export class CameraHelper {
    constructor() {
        this.wrapper = new Object3D();
        this.offset = new Vector3();
        this.position = new Vector3();
        this.lerpSpeed = 0.5;
    }

    init() {
        const { scene, camera } = core;

        camera.lookAt(0, 0, 0);
        camera.wrapper = this.wrapper;
        this.wrapper.add(camera);
        scene.add(this.wrapper);

        const preset = config.camera.preset.value;
        const { offset, position, rotation } = CAMERA_SETTINGS[preset];

        camera.position.copy(position);
        this.offset.copy(offset);

        if (rotation) {
            const { x, y, z } = rotation;
            this.wrapper.rotation.set(x, y, z);
        }
    }

    update(characterToFollow) {
        if (!characterToFollow) {
            return;
        }

        const model = characterToFollow.getModel();

        this.position.copy(model.position);
        this.position.add(this.offset);

        this.wrapper.position.lerp(this.position, this.lerpSpeed);
    }

    focusOnPlayer(player) {
        const { y: cy, z: cz } = threeScene.camera.position;
        tweens.add(
            threeScene.camera.position,
            { y: cy * 0.5, z: cz * 0.5 },
            1000,
        );
    }
}

export const cameraHelper = new CameraHelper();
