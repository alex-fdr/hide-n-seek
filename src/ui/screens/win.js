import { Container } from 'pixi.js';
import { Button } from '../components/button';
import { tweens } from '../../helpers/tweens';

export class WinScreen {
    constructor(visible) {
        this.btn = new Button('button', 'winBtn', {
            fill: '#ffffff',
            dropShadow: {
                color: 0x444444,
                angle: Math.PI / 4,
                distance: 1,
                alpha: 1,
            },
        });

        this.group = new Container({
            visible,
            label: 'win',
            children: [this.btn.group],
        });
    }

    show() {
        this.group.visible = true;
        tweens.fadeIn(this.group, 500);
        tweens.pulse(this.btn.group, 600, { scaleTo: 1.1, repeat: -1 });
    }

    hide() {
        this.group.visible = false;
    }

    handlePortrait(cx, cy) {
        this.group.scale.set(1);
        this.group.position.set(cx, cy);
        this.btn.group.position.set(0, 360);
    }

    handleLandscape(cx, cy, factor) {
        this.group.scale.set(0.465 * factor);
        this.group.position.set(cx, cy);
        this.btn.group.position.set(0, 360);
    }
}
