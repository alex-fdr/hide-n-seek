import { tweens } from '@alexfdr/three-game-components';
import { assets, core } from '@alexfdr/three-game-core';
import { MeshPhongMaterial } from 'three';
import { config } from '../data/config';
import { ROLE_HIDER } from '../data/game-const';

export class Cage {
    constructor() {
        this.model = this.addModel();
    }

    addModel() {
        const model = assets.models.get('cage');
        model.name = 'cage-group';
        model.scale.y *= 1.4;
        model.visible = false;

        const mesh = model.children[0];
        mesh.castShadow = true;
        mesh.material = new MeshPhongMaterial({
            color: '#496176',
            shininess: 300,
        });

        const size = config.playerRole === ROLE_HIDER ? config.playerSize : config.enemiesSize;
        model.scale.multiplyScalar(size * 0.75);

        core.scene.add(model);
        return model;
    }

    show({ position }) {
        this.model.visible = true;
        this.model.position.copy(position);
        this.model.position.y = 1;
        this.model.rotation.y = 0.4;

        tweens.add(this.model.position, 400, {
            easing: 'backOut',
            to: { y: 0.05 },
            // delay: 50,
        });
    }

    hide() {
        this.model.visible = false;
    }
}
