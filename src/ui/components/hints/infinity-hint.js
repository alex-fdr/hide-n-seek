import { Assets, Container, Sprite } from 'pixi.js';
import { tweens } from '../../../helpers/tweens';

export class InfinityHint {
    constructor(props) {
        this.enabled = true;

        this.halfAmplitudeX = props.amplitudeX
            ? Math.floor(props.amplitudeX / 2)
            : 116;
        this.halfAmplitudeY = props.amplitudeY
            ? Math.floor(props.amplitudeY / 2)
            : 46;
        this.time = props.time || 2000;
        this.offsetX = props.offsetX || 0;
        this.offsetY = props.offsetY || 0;

        this.infinity = new Sprite({
            anchor: 0.5,
            texture: Assets.get(props.baseKey || 'infinity'),
        });

        // idea - apply offset to hand

        this.pointer = new Sprite({
            texture: Assets.get(props.pointerKey || 'pointer'),
            anchor: 0.5,
            scale: props.pointerScale || 1,
            position: { x: this.offsetX, y: this.offsetY },
        });

        this.pointerGroup = new Container({
            children: [this.pointer],
        });

        this.group = new Container({
            label: 'infinity-hint',
            visible: props.visible,
            children: [this.infinity, this.pointerGroup],
        });

        // tween props
        this.propsIn = { easing: 'sineIn' };
        this.propsOut = { easing: 'sineOut' };
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
        this.animatePointerRightFrom9to12();
    }

    animatePointerRightFrom9to12() {
        this.tweenX = tweens.add(
            this.pointerGroup,
            { x: this.halfAmplitudeX },
            this.time * 0.5,
            this.propsOut,
        );
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: -this.halfAmplitudeY },
            this.time * 0.25,
            this.propsOut,
        );
        this.tweenY.onComplete(() => this.animatePointerRightFrom12to3());
    }

    animatePointerRightFrom12to3() {
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: 0 },
            this.time * 0.25,
            this.propsIn,
        );
        this.tweenY.onComplete(() => this.animatePointerRightFrom3to6());
    }

    animatePointerRightFrom3to6() {
        this.tweenX = tweens.add(
            this.pointerGroup,
            { x: 0 },
            this.time * 0.5,
            this.propsIn,
        );
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: this.halfAmplitudeY },
            this.time * 0.25,
            this.propsOut,
        );
        this.tweenY.onComplete(() => this.animatePointerRightFrom6to9());
    }

    animatePointerRightFrom6to9() {
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: 0 },
            this.time * 0.25,
            this.propsIn,
        );
        this.tweenY.onComplete(() => this.animatePointerLeftFrom3to12());
    }

    animatePointerLeftFrom3to12() {
        this.tweenX = tweens.add(
            this.pointerGroup,
            { x: -this.halfAmplitudeX },
            this.time * 0.5,
            this.propsOut,
        );
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: -this.halfAmplitudeY },
            this.time * 0.25,
            this.propsOut,
        );
        this.tweenY.onComplete(() => this.animatePointerLeftFrom12to9());
    }

    animatePointerLeftFrom12to9() {
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: 0 },
            this.time * 0.25,
            this.propsIn,
        );
        this.tweenY.onComplete(() => this.animatePointerLeftFrom9to6());
    }

    animatePointerLeftFrom9to6() {
        this.tweenX = tweens.add(
            this.pointerGroup,
            { x: 0 },
            this.time * 0.5,
            this.propsIn,
        );
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: this.halfAmplitudeY },
            this.time * 0.25,
            this.propsOut,
        );
        this.tweenY.onComplete(() => this.animatePointerLeftFrom6to12());
    }

    animatePointerLeftFrom6to12() {
        this.tweenY = tweens.add(
            this.pointerGroup,
            { y: 0 },
            this.time * 0.25,
            this.propsIn,
        );
        this.tweenY.onComplete(() => this.animatePointerRightFrom9to12());
    }
}
