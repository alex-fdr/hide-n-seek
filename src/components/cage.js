import { assets, core } from '@alexfdr/three-game-core';
import { materials } from '../helpers/materials';
import { tweens } from '../helpers/tweens';
import config from '../assets/settings/config';
import { ROLE_HIDER } from '../data/game-const';

export class Cage {
    constructor() {
        this.model = this.addModel();
    }

    addModel() {
        const model = assets.models.get('cage');
        model.scale.multiplyScalar(0.75);
        model.scale.y *= 1.5;
        model.visible = false;

        const size =
            config.player.role.value === ROLE_HIDER
                ? config.player.size.value
                : config.enemies.size.value;

        model.scale.multiplyScalar(size);
        model.children[0].castShadow = true;

        materials.replace(model, 'phong', {
            color: '#496176',
            shininess: 300,
        });

        core.scene.add(model);
        return model;
    }

    show({ position }) {
        this.model.position.copy(position);
        this.model.rotation.y = 0.4;
        this.model.visible = true;

        this.model.position.y = 1;

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
