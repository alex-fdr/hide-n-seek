import { core } from '@alexfdr/three-game-core';
import {
    FrontSide,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    Scene,
} from 'three';
import { tweens } from '../../helpers/tweens';
import config from '../../assets/settings/config';

export class OverlayHelper {
    constructor({ frontObjects = [] }) {
        this.frontScene = this.createScene(frontObjects);
        this.mesh = this.createMesh();

        this.status = {
            visible: false,
        };

        this.hide();
    }

    createScene(frontObjects) {
        const frontScene = new Scene();

        for (const obj of frontObjects) {
            const copy = obj.clone();
            frontScene.attach(copy);
        }

        for (const light of core.scene.lights) {
            frontScene.attach(light.clone());
        }

        return frontScene;
    }

    createMesh() {
        const size = 100;
        const geometry = new PlaneGeometry(size, size);
        const material = new MeshLambertMaterial({
            color: 0x000000,
            transparent: true,
            opacity: config.overlay.opacity.value,
            side: FrontSide,
        });

        const mesh = new Mesh(geometry, material);
        mesh.position.set(0, 5, 0);
        mesh.rotation.x = -Math.PI * 0.5;
        mesh.frustumCulled = false;
        core.scene.add(mesh);
        return mesh;
    }

    show() {
        if (this.status.visible) {
            return;
        }

        this.toggleVisibility(true);
        tweens.fadeIn3(this.mesh, 1000);
    }

    hide() {
        if (!this.status.visible) {
            return;
        }

        this.toggleVisibility(false);
    }

    toggleVisibility(value) {
        this.status.visible = value;
        this.mesh.visible = value;
        this.frontScene.visible = value;
        core.renderer.autoClear = !value;
    }

    update() {
        if (this.status.visible) {
            core.renderer.clearDepth();
            core.renderer.render(this.frontScene, core.camera);
        }
    }
}
