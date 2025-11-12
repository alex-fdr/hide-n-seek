import { Assets, Container, TilingSprite } from 'pixi.js';
import { Button } from '../components/button';
import { tweens } from '../../helpers/tweens';

export class LoseScreen {
    constructor({ parent, visible }) {
        this.overlay = new TilingSprite({
            texture: Assets.get('dummy-white'),
            label: 'lose-overlay',
            width: 1024,
            height: 1024,
            tint: 0x000000,
            alpha: 0.6,
            anchor: 0.5,
        });

        this.btn = new Button('button', 'loseBtn', {
            fill: '#ffffff',
            dropShadow: {
                color: 0x444444,
                alpha: 1,
                distance: 1,
                angle: Math.PI / 4,
            },
        });

        this.group = new Container({
            parent,
            visible,
            label: 'win',
            children: [this.overlay, this.btn.group],
        });
    }

    show() {
        this.group.visible = true;
        tweens.fadeIn(this.group, 500);
        tweens.pulse(this.btn.group, 600, {
            scaleTo: 1.1,
            repeat: -1,
        });
    }

    hide() {
        this.group.visible = false;
    }

    handlePortrait(cx, cy) {
        this.group.scale.set(1);
        this.overlay.scale.set(1);
        this.btn.group.position.set(0, 360);
    }

    handleLandscape(cx, cy, factor) {
        this.group.scale.set(factor);
        this.overlay.scale.set(1 / this.group.scale.x);
        this.btn.group.position.set(0, 360);
    }
}
