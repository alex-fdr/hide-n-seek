import { core } from '@alexfdr/three-game-core';
import { Object3D, Vector3 } from 'three';
import { config } from '../../data/config';
import { CAMERA_SETTINGS } from '../../data/game-const';
import { tweens } from '../../systems/tweens';

export class CameraHelper {
    constructor() {
        this.wrapper = new Object3D();
        this.offset = new Vector3();
        this.position = new Vector3();
        this.lerpSpeed = 0.5;

        core.camera.lookAt(0, 0, 0);
        core.camera.wrapper = this.wrapper;
        this.wrapper.add(core.camera);
        core.scene.add(this.wrapper);
        this.wrapper.name = 'camera-wrapper';

        const preset = config.cameraPreset;
        const { position, offset, rotation } = CAMERA_SETTINGS[preset];
        core.camera.position.copy(position);
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

    focusOnLevelCenter() {
        const { y, z } = core.camera.position;
        tweens.add(core.camera.position, 1000, {
            to: {
                y: y * 0.5,
                z: z * 0.5,
            },
        });
    }
}
