import { Assets, Container, Sprite, Text } from 'pixi.js';
import { tweens } from '../../helpers/tweens';
import { locale } from '../../data/locale';

export class Button {
    constructor(spriteKey, textKey, textStyle) {
        this.sprite = new Sprite({
            texture: Assets.get(spriteKey),
            label: 'btn-sprite',
            anchor: 0.5,
        });

        this.text = new Text({
            text: locale[textKey].text,
            anchor: 0.5,
            style: {
                fontSize: locale[textKey].fontSize,
                ...textStyle,
            },
        });

        this.group = new Container({
            label: 'btn-group',
            children: [this.sprite, this.text],
        });
    }

    getPosition() {
        return this.group.position;
    }

    setPosition(x = 0, y = 0) {
        this.group.position.set(x, y);
    }

    setScale(sx = 1, sy = sx) {
        this.group.scale.set(sx, sy);
    }

    setInputHandler(handler) {
        this.sprite.interactive = true;
        this.sprite.once('pointerup', handler);
    }

    showPressEffect() {
        this.tween = tweens.pulse(this.group, 300, { scaleTo: 0.9 });
    }
}
