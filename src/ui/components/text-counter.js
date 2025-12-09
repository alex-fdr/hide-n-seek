import { tweens } from '@alexfdr/three-game-components';
import { Container, Text } from 'pixi.js';
import { Signal } from '../../helpers/signal';

export class TextCounter {
    constructor(props) {
        const {
            value = 0,
            prefix = '',
            suffix = '',
            fontSize = 40,
            color = '#fff',
            bounceAnimation = false,
            changeAnimation = false,
            changeTime = 300,
            bounceTime = 300,
            bounceFactor = 1.2,
            bounceColor = color,
            digitsAfterPoint = 0,
            zeroPrefix = false,
            separator = '.',
            textAlignLeft = false,
            textAlignRight = false,
        } = props;

        this.prefix = prefix;
        this.suffix = suffix;
        this.value = value;
        this.bounceAnimation = bounceAnimation;
        this.changeAnimation = changeAnimation;
        this.bounceTime = bounceTime;
        this.changeTime = changeTime;
        this.bounceFactor = bounceFactor;
        this.bounceColor = bounceColor;
        this.color = color;
        this.digitsAfterPoint = Math.abs(digitsAfterPoint);
        this.zeroPrefix = zeroPrefix;
        this.separator = separator;

        this.isNewColorOnBounce = !!bounceColor;
        this.isCustomSeparator = this.separator !== '.';

        this.text = new Text({
            text: this.getValue(value),
            anchor: 0.5,
            style: {
                fontSize,
                fontFamily: 'gamefont',
                fill: color,
            },
        });
        this.group = new Container({
            label: 'text-counter-group',
            children: [this.text],
        });

        this.finalValue = 0;
        this.onComplete = new Signal();

        if (textAlignLeft) {
            this.text.align = 'left';
            this.text.anchor.x = 0;
        } else if (textAlignRight) {
            this.text.align = 'right';
            this.text.anchor.x = 1;
        }
    }

    setValue(value) {
        this.value = value;
        this.text.text = this.getValue(value);
    }

    getValue(value) {
        let val;
        let str;

        if (this.digitsAfterPoint) {
            val = value.toFixed(this.digitsAfterPoint);
        } else {
            val = Math.floor(value);
        }

        if (this.zeroPrefix) {
            str = this.applyZeroPrefix(val);
        } else {
            str = val.toString();
        }

        if (this.isCustomSeparator) {
            str = str.replace('.', this.separator);
        }

        return this.prefix + str + this.suffix;
    }

    updateValue(amount = 1) {
        if (this.bounceAnimation) {
            this.text.scale.set(1);

            const bounceTween = tweens.pulse(this.text, this.bounceTime, {
                scaleTo: this.bounceFactor,
            });

            if (this.isNewColorOnBounce) {
                this.changeTextColor(bounceTween);
            }
        }

        if (!this.changeAnimation) {
            this.value += amount;
            this.text.text = this.getValue(this.value);
            return;
        }

        const fromValue = this.value;
        const toValue = this.value + amount;
        const dummy = { value: 0 };
        this.finalValue = toValue;

        this.tween = tweens.add(dummy, this.changeTime, {
            easing: 'linear',
            to: { value: amount },
        });

        this.tween.onUpdate(() => {
            this.text.text = this.getValue(fromValue + dummy.value);
            this.value = fromValue + dummy.value;
        });

        this.tween.onComplete(() => {
            this.text.text = this.getValue(toValue);
            this.value = toValue;
            this.onComplete.dispatch();
        });
    }

    changeTextColor(tween) {
        tween.onStart(() => {
            this.text.addColor(this.bounceColor, 0);
        });

        tween.onComplete(() => {
            this.text.addColor(this.color, 0);
        });
    }

    applyZeroPrefix(value) {
        // add one leading zero if the value has only one digit
        return value < 10 ? `0${value}` : value.toString();
    }

    stop() {
        this.tween?.stop();
    }
}
