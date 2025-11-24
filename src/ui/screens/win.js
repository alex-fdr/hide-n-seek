import { Container } from 'pixi.js';
import { Button } from '../components/button';
import { tweens } from '../../systems/tweens';

export class WinScreen {
    constructor({ parent, visible }) {
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
            parent,
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

    handlePortrait() {
        this.group.scale.set(1);
        this.btn.group.position.set(0, 360);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.btn.group.position.set(0, 360);
    }
}
