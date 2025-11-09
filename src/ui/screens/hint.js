import { InfinityHint } from '../components/hints/infinity-hint';
import { tweens } from '../../helpers/tweens';
import { factory } from '../pixi-factory';

export class HintScreen {
    constructor(visible) {
        this.hint = new InfinityHint({
            time: 1300,
            baseKey: 'infinity-sign',
            pointerKey: 'pointer',
            amplitudeX: 195,
            amplitudeY: 90,
            offsetX: 30,
            offsetY: 45,
        });

        this.status = {
            animated: false,
        };

        this.group = factory.group([this.hint.group], visible);
    }

    show() {
        this.group.visible = true;

        if (!this.status.animated) {
            this.status.animated = true;
            this.animate();
        }
    }

    hide() {
        this.group.visible = false;
    }

    animate() {
        tweens.fadeIn(this.group, 300);
        this.hint.animate();
    }

    handlePortrait(cx, cy) {
        this.group.scale.set(1);
        this.group.position.set(cx, cy);
        this.hint.setPosition(0, 225);
    }

    handleLandscape(cx, cy, factor) {
        this.group.scale.set(0.465 * factor);
        this.group.position.set(cx, cy);
        this.hint.setPosition(0, 225);
    }

    setPosition(x, y) {
        this.pointerOld.position.set(x, y);
    }
}
