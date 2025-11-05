import config from '../../assets/settings/config';
import { core } from '../../core/game-core';
import { tweens } from '../../helpers/tweens';
import { CAMERA_SETTINGS } from '../../models/game-const';
import { Object3D, Vector3 } from 'three';


export class CameraHelper {
    constructor() {
        this.wrapper = new Object3D();
        this.offset = new Vector3();
        this.position = new Vector3();
        this.lerpSpeed = 0.5;
    }

    init() {
        const { scene, camera } = core;

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
        tweens.add(threeScene.camera.position, { y: cy * 0.5, z: cz * 0.5 }, 1000);
    }
}

export const cameraHelper = new CameraHelper();