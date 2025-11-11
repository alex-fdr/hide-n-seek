import { Assets, Container, TilingSprite } from 'pixi.js';
import { pixiUI } from '../pixi-ui';
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
        this.overlay.setSize(cx * 2, cy * 2);
        this.btn.group.position.set(0, cy - 100);
    }

    handleLandscape(cx, cy) {
        this.overlay.setSize(cx * 2, cy * 2);
        this.btn.group.position.set(0, cy - 60);
    }
}
