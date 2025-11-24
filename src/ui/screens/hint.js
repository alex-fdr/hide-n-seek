import { Container } from 'pixi.js';
import { InfinityHint } from '../components/hints/infinity-hint';
import { tweens } from '../../systems/tweens';

export class HintScreen {
    constructor({ parent, visible }) {
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
            enabled: true,
        };

        this.group = new Container({
            parent,
            visible,
            label: 'hint-screen',
            children: [this.infinityHint.group],
        });

        // this.showTimestamp = 0;
        this.showInterval = 3000;
        this.timeoutId = 0;
    }

    show() {
        if (!this.status.enabled) {
            return;
        }

        this.group.visible = true;

        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
        }

        if (!this.status.animated) {
            this.status.animated = true;
            this.animate();
        }
    }

    hide(turnOff = false) {
        this.group.visible = false;

        if (turnOff) {
            this.status.enabled = false;
            this.infinityHint.stopAnimations();
        }
    }

    sheduleNextShow() {
        if (!this.status.enabled) {
            return;
        }

        this.timeoutId = setTimeout(() => {
            this.show();
        }, this.showInterval);
    }

    animate() {
        tweens.fadeIn(this.group, 300);
        this.infinityHint.animate();
    }

    handlePortrait() {
        this.group.scale.set(1);
        this.infinityHint.setPosition(0, 225);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.infinityHint.setPosition(0, 225);
    }
}
