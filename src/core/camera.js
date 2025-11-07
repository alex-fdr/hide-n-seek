import { Object3D, PerspectiveCamera } from 'three';
import { gameSettings } from '../models/game-settings';

export class Camera extends PerspectiveCamera {
    constructor(props, scene) {
        const { fov, near, far, position, following } = props;

        super(fov.portrait, 1, near, far);

        this.position.copy(position);

        if (following) {
            this.addWrapper(scene, following);
        }
    }

    addWrapper(scene, props = {}) {
        const { x = 0, y = 0, z = 0 } = props.position;
        this.wrapper = new Object3D();
        this.wrapper.position.set(x, y, z);
        this.wrapper.add(this);
        scene.add(this.wrapper);
        this.lookAt(x, y, z);
    }

    resize(width, height) {
        const { fov } = gameSettings.camera;
        this.aspect = width / height;
        this.fov = this.aspect > 1 ? fov.landscape : fov.portrait;
        this.updateProjectionMatrix();
    }
}
