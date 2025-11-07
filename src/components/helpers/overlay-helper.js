import {
    FrontSide,
    Mesh,
    MeshLambertMaterial,
    PlaneGeometry,
    Scene,
} from 'three';

import { core } from '../../core/game-core';
import { tweens } from '../../helpers/tweens';
import config from '../../assets/settings/config';

export class OverlayHelper {
    constructor() {
        this.frontObjects = [];

        this.status = {
            visible: false,
        };
    }

    init(frontObjects = []) {
        this.createScene(frontObjects);
        this.createMesh();
        this.hide();
    }

    createScene(frontObjects) {
        this.frontScene = new Scene();

        for (const obj of frontObjects) {
            const copy = obj.clone();
            this.frontObjects.push(copy);
            this.frontScene.attach(copy);
        }

        for (const light of core.scene.lights) {
            this.frontScene.attach(light.clone());
        }
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

        this.mesh = new Mesh(geometry, material);
        this.mesh.position.set(0, 5, 0);
        this.mesh.rotation.x = -Math.PI * 0.5;
        this.mesh.frustumCulled = false;
        core.scene.add(this.mesh);
    }

    show() {
        if (this.status.visible) {
            return;
        }

        core.renderer.autoClear = false;
        this.status.visible = true;
        this.mesh.visible = true;
        this.frontScene.visible = true;
        tweens.fadeIn3(this.mesh, 1000);
    }

    hide() {
        if (!this.status.visible) {
            return;
        }

        this.status.visible = false;
        this.mesh.visible = false;
        this.frontScene.visible = false;
        core.renderer.autoClear = true;
    }

    update() {
        if (this.status.visible) {
            core.renderer.clearDepth();
            core.renderer.render(this.frontScene, core.camera);
        }
    }
}
