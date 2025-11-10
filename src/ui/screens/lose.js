import { Assets, Container, TilingSprite } from 'pixi.js';
import { Button } from '../components/button';
import { tweens } from '../../helpers/tweens';

export class LoseScreen {
    constructor(visible) {
        this.overlay = new TilingSprite({
            texture: Assets.get('dummy-white'),
            label: 'lose-overlay',
            width: 960,
            height: 960,
            tint: 0x000000,
            alpha: 0.6,
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

        // this.btn.text.position.set(0, -3)
        // this.btn.sprite.scale.set(0.75)

        this.group = new Container({
            visible,
            label: 'win',
            children: [this.overlay, this.btn.group],
        });
    }

    show() {
        this.group.visible = true;
        tweens.fadeIn(this.group, 500);
        tweens.pulse(this.btn.group, 1.1, 600, { repeat: -1 });
    }

    hide() {
        this.group.visible = false;
    }

    handlePortrait(cx, cy) {
        this.group.scale.set(1);
        this.overlay.scale.set(1);
        this.group.position.set(cx, cy);
        this.btn.group.position.set(0, 360);
    }

    handleLandscape(cx, cy, factor) {
        this.group.scale.set(0.465 * factor);
        this.overlay.scale.set(1 / this.group.scale.x);
        this.group.position.set(cx, cy);
        this.btn.group.position.set(0, 360);
    }
}
