import { tweens } from '@alexfdr/three-game-components';
import { Assets, Container, Sprite } from 'pixi.js';

export class InfinityHint {
    constructor(props) {
        const {
            amplitudeX = 120,
            amplitudeY = 50,
            offsetX = 0,
            offsetY = 0,
            time = 2000,
            baseKey = 'infinity',
            pointerKey = 'pointer',
            pointerScale = 1,
            visible = true,
        } = props;

        this.enabled = true;
        this.halfAmplitudeX = Math.floor(amplitudeX / 2);
        this.halfAmplitudeY = Math.floor(amplitudeY / 2);
        this.offsetX = offsetX;
        this.offsetY = offsetY;
        this.time = time;
        this.timeHalf = time * 0.5;
        this.timeQuarter = time * 0.25;

        this.tweenX = null;
        this.tweenY = null;

        this.infinity = new Sprite({
            texture: Assets.get(baseKey),
            anchor: 0.5,
        });

        this.pointer = new Sprite({
            texture: Assets.get(pointerKey),
            anchor: 0.5,
            scale: pointerScale,
            x: this.offsetX,
            y: this.offsetY,
        });

        this.pointerGroup = new Container({
            children: [this.pointer],
        });

        this.group = new Container({
            label: 'infinity-hint',
            visible,
            children: [this.infinity, this.pointerGroup],
        });
    }

    show() {
        if (!this.enabled) {
            return;
        }

        this.group.visible = true;
        tweens.fadeIn(this.group, 300);
    }

    hide() {
        tweens.fadeOut(this.group, 200).onComplete(() => {
            this.group.visible = false;
        });
    }

    setPosition(x, y) {
        this.group.position.set(x, y);
    }

    animate() {
        this.animateRightFrom9to12();
    }

    stopAnimations() {
        tweens.remove(this.tweenX);
        tweens.remove(this.tweenY);
    }

    animateRightFrom9to12() {
        this.tweenX = tweens.add(this.pointerGroup, this.timeHalf, {
            easing: 'sineOut',
            to: { x: this.halfAmplitudeX },
        });
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            to: { y: -this.halfAmplitudeY },
            easing: 'sineOut',
            onComplete: () => this.animateRightFrom12to3(),
        });
    }

    animateRightFrom12to3() {
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            easing: 'sineIn',
            to: { y: 0 },
            onComplete: () => this.animateRightFrom3to6(),
        });
    }

    animateRightFrom3to6() {
        this.tweenX = tweens.add(this.pointerGroup, this.timeHalf, {
            easing: 'sineIn',
            to: { x: 0 },
        });
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            easing: 'sineOut',
            to: { y: this.halfAmplitudeY },
            onComplete: () => this.animateRightFrom6to9(),
        });
    }

    animateRightFrom6to9() {
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            easing: 'sineIn',
            to: { y: 0 },
            onComplete: () => this.animateLeftFrom3to12(),
        });
    }

    animateLeftFrom3to12() {
        this.tweenX = tweens.add(this.pointerGroup, this.timeHalf, {
            easing: 'sineOut',
            to: { x: -this.halfAmplitudeX },
        });
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            easing: 'sineOut',
            to: { y: -this.halfAmplitudeY },
            onComplete: () => this.animateLeftFrom12to9(),
        });
    }

    animateLeftFrom12to9() {
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            easing: 'sineIn',
            to: { y: 0 },
            onComplete: () => this.animateLeftFrom9to6(),
        });
    }

    animateLeftFrom9to6() {
        this.tweenX = tweens.add(this.pointerGroup, this.timeHalf, {
            easing: 'sineIn',
            to: { x: 0 },
        });
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            easing: 'sineOut',
            to: { y: this.halfAmplitudeY },
            onComplete: () => this.animateLeftFrom6to12(),
        });
    }

    animateLeftFrom6to12() {
        this.tweenY = tweens.add(this.pointerGroup, this.timeQuarter, {
            easing: 'sineIn',
            to: { y: 0 },
            onComplete: () => this.animateRightFrom9to12(),
        });
    }
}
