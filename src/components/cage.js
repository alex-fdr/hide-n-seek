import { assets, core } from '@alexfdr/three-game-core';
import { materials } from '../helpers/materials';
import { tweens } from '../helpers/tweens';
import config from '../assets/settings/config';

export class Cage {
    constructor() {
        this.model = null;
    }

    init() {
        this.addModel();
    }

    addModel() {
        const model = assets.models.get('cage');
        model.scale.multiplyScalar(0.75);
        model.scale.y *= 1.5;
        model.visible = false;

        const size =
            config.player.role.value === 'hider'
                ? config.player.size.value
                : config.enemies.size.value;

        model.scale.multiplyScalar(size);
        model.children[0].castShadow = true;

        materials.replace(model, 'phong', {
            color: '#496176',
            shininess: 300,
        });

        core.scene.add(model);

        this.model = model;
    }

    show({ position }) {
        this.model.position.copy(position);
        this.model.rotation.y = 0.4;
        this.model.visible = true;

        this.model.position.y = 1;

        tweens.add(this.model.position, { y: 0.05 }, 400, {
            easing: 'backOut',
            // delay: 50,
        });
    }

    hide() {
        this.model.visible = false;
    }
}
