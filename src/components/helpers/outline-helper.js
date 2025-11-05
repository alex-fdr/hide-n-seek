import { Color } from 'three';
import { core } from '../../core/game-core';
import { OutlineEffect } from '../../libs/OutlineEffect';

export class OutlineHelper {
    constructor() {
        this.outlineParameters = {
            thickness: 0.002,
            color: [0.05, 0.05, 0.05],
            alpha: 0.8,
            visible: true,
            keepAlive: false,
        };
    }

    init(props = {}) {
        const { color } = props;

        if (color) {
            this.outlineParameters.color = new Color(color).toArray();
        }

        this.effect = new OutlineEffect(core.renderer);
    }

    update() {
        if (this.effect) {
            this.effect.render(core.scene, core.camera);
        }
    }

    setOutlinedObjects(objects = []) {
        for (const o of objects) {
            o.material.userData.outlineParameters = this.outlineParameters;
        }

        this.effect.setOutlinedObjects(objects);
    }
}

export const outlineHelper = new OutlineHelper();
