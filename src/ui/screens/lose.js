import { Button } from '../components/button';
import { tweens } from '../../helpers/tweens';
import { factory } from '../pixi-factory';

export class LoseScreen {
    constructor(visible) {
        this.overlay = factory.tilesprite('dummy-white', 960, 960);
        // this.overlay.tint = 0x00896c
        this.overlay.tint = 0x000000;
        this.overlay.alpha = 0.6;

        this.btn = new Button('button', 'loseBtn', { color: '#ffffff' });
        // this.btn.text.position.set(0, -3)
        // this.btn.sprite.scale.set(0.75)

        factory.textShadow(this.btn.text, 0x444444, 1, 1);

        this.group = factory.group(
            [this.overlay, this.btn.group],
            visible,
            'win',
        );
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
