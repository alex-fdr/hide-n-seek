import {
    AnimatedSprite,
    Assets,
    Container,
    Graphics,
    Sprite,
    Text,
    TilingSprite,
} from 'pixi.js';
import locale from '../assets/settings/l10n';

class PixiFactory {
    init() {}

    sprite(key) {
        return new Sprite({
            texture: Assets.get(key),
            anchor: 0.5,
        });
    }

    text(key, style = {}) {
        const str = locale[key];
        const [text, fontSize] = str.split('^');
        return new Text({
            text: text,
            anchor: 0.5,
            style: {
                fontFamily: 'gamefont',
                fontSize: fontSize,
                align: 'center',
                ...style,
            },
        });
    }

    tilesprite(key, width = 960, height = 960) {
        return new TilingSprite({
            texture: Assets.get(key),
            width,
            height,
            anchor: 0.5,
        });
    }

    group(children = [], visible = true, name = '') {
        return new Container({
            label: name,
            visible,
            children: [...children],
        });
    }

    pixiGraphics() {
        return new Graphics();
    }

    animatedSprite(props = {}) {
        const { key } = props;
        const {
            speed = 0.25,
            loopDelay = 0,
            loop = true,
            autostart = true,
            yoyo = false,
        } = props;
        const { from, to, digits } = props.frames || {
            from: 1,
            to: 1,
            digits: 2,
        };

        const names = this.generateFrameNames(
            key,
            from,
            to,
            digits,
            yoyo,
            props.remapFrames,
        );
        const textures = names.map((name) => this.resources[name].texture);
        const sprite = new AnimatedSprite(textures);
        sprite.anchor.set(0.5);

        if (speed) {
            sprite.animationSpeed = speed;
        }

        if (loop) {
            sprite.loop = true;

            if (loopDelay) {
                sprite.loop = false;
                sprite.onComplete = () =>
                    setTimeout(() => sprite.gotoAndPlay(0), loopDelay);
            }
        } else {
            sprite.loop = false;
        }

        if (autostart) {
            sprite.play();
        }

        return sprite;
    }

    generateFrameNames(
        name,
        from = 1,
        to = 1,
        digits = 2,
        yoyo = false,
        remapFrames = {},
    ) {
        const names = [];
        const zeroPrefix = new Array(digits).join('0');
        const zeroPrefix10 = new Array(digits - 1).join('0');

        const remapKeys = Object.keys(remapFrames);
        const remapValues = Object.keys(remapFrames).map(
            (key) => remapFrames[key],
        );

        const getRemappedFrame = (frameIndex) => {
            for (let i = 0; i < remapValues.length; i++) {
                if (remapValues[i].indexOf(frameIndex) !== -1) {
                    return remapKeys[i];
                }
            }
            return frameIndex;
        };

        for (let i = from; i <= to; i++) {
            const suffix = i < 10 ? zeroPrefix : zeroPrefix10;
            const index = getRemappedFrame(i);
            const key = `${name}${suffix}${index}`;
            names.push(key);
        }

        if (yoyo) {
            return names.concat([...names].reverse());
        }

        return names;
    }

    textShadow(text, color = 0xffffff, alpha = 0.9, distance = 5, angle = 90) {
        text.style.dropShadow = true;
        text.style.dropShadowColor = color;
        text.style.dropShadowAlpha = alpha;
        text.style.dropShadowDistance = distance;
        text.style.dropShadowAngle = angle * (Math.PI / 180);
        return text;
    }

    setTexture(sprite, key) {
        sprite.texture = this.resources[key].texture;
    }
}

export const factory = new PixiFactory();
