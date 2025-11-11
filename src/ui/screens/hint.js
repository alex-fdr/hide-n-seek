import { Container } from 'pixi.js';
import { InfinityHint } from '../components/hints/infinity-hint';
import { tweens } from '../../helpers/tweens';

export class HintScreen {
    constructor(visible) {
        this.infinityHint = new InfinityHint({
            time: 2000,
            baseKey: 'infinity-sign',
            pointerKey: 'pointer',
            amplitudeX: 190,
            amplitudeY: 90,
            offsetX: 30,
            offsetY: 50,
        });

        this.status = {
            animated: false,
        };

        this.group = new Container({
            visible,
            label: 'hint-screen',
            children: [this.infinityHint.group],
        });
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
        this.infinityHint.animate();
    }

    handlePortrait(cx, cy) {
        this.infinityHint.setPosition(0, cy - 180);
    }

    handleLandscape(cx, cy, factor) {
        this.infinityHint.setPosition(0, cy - 100);
    }
}
