import { core } from '@alexfdr/three-game-core';
import { Color } from 'three';
import { OutlineEffect } from '../../libs/OutlineEffect';

export class OutlineHelper {
    constructor({ color }) {
        this.outlineParameters = {
            thickness: 0.002,
            color: color ? new Color(color).toArray() : [0, 0, 0],
            alpha: 0.8,
            visible: true,
            keepAlive: false,
        };

        this.effect = new OutlineEffect(core.renderer);
    }

    render() {
        this.effect.renderOutline(core.scene, core.camera);
    }

    setOutlinedObjects(objects = []) {
        for (const o of objects) {
            o.material.userData.outlineParameters = this.outlineParameters;
        }

        this.effect.setOutlinedObjects(objects);
    }
}
