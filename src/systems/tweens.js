import { Easing, Group, Tween } from '@tweenjs/tween.js';

const mapping = {
    linear: Easing.Linear.None,

    quad: Easing.Quadratic.InOut,
    quadIn: Easing.Quadratic.In,
    quadOut: Easing.Quadratic.Out,

    cubic: Easing.Cubic.InOut,
    cubicIn: Easing.Cubic.In,
    cubicOut: Easing.Cubic.Out,

    quar: Easing.Quartic.InOut,
    quarIn: Easing.Quartic.In,
    quarOut: Easing.Quartic.Out,

    quint: Easing.Quintic.InOut,
    quintIn: Easing.Quintic.In,
    quintOut: Easing.Quintic.Out,

    sine: Easing.Sinusoidal.InOut,
    sineIn: Easing.Sinusoidal.In,
    sineOut: Easing.Sinusoidal.Out,

    exp: Easing.Exponential.InOut,
    expIn: Easing.Exponential.In,
    expOut: Easing.Exponential.Out,

    circ: Easing.Circular.InOut,
    circIn: Easing.Circular.In,
    circOut: Easing.Circular.Out,

    elastic: Easing.Elastic.InOut,
    elasticIn: Easing.Elastic.In,
    elasticOut: Easing.Elastic.Out,

    back: Easing.Back.InOut,
    backIn: Easing.Back.In,
    backOut: Easing.Back.Out,

    bounce: Easing.Bounce.InOut,
    bounceIn: Easing.Bounce.In,
    bounceOut: Easing.Bounce.Out,
};

class TweensFactory {
    constructor() {
        this.tweens = [];
        this.group = new Group();
    }

    add(target, time = 300, props = {}) {
        const {
            easing = 'sine',
            autostart = true,
            delay = 0,
            repeat = 0,
            repeatDelay = 0,
            yoyo = false,
            to,
            onComplete,
        } = props;

        const tween = new Tween(target)
            .to(to, time)
            .easing(mapping[easing])
            .delay(delay)
            .repeat(repeat === -1 ? Infinity : repeat)
            .repeatDelay(repeatDelay)
            .yoyo(yoyo);

        if (autostart) {
            tween.start();
        }

        if (onComplete) {
            tween.onComplete(onComplete);
        }

        this.tweens.push(tween);
        this.group.add(tween);
        return tween;
    }

    remove(tween) {
        this.group.remove(tween);
        this.tweens.splice(this.tweens.indexOf(tween), 1);
    }

    pause() {
        for (const tween of this.tweens) {
            tween.pause();
        }
    }

    resume() {
        for (const tween of this.tweens) {
            tween.resume();
        }
    }

    update(time) {
        this.group.update(time);
    }

    wait(time) {
        const from = { k: 0 };
        const to = { k: 1 };
        const tween = this.add(from, time, {
            easing: 'linear',
            autostart: true,
            to,
        });
        return new Promise((resolve) => {
            tween.onComplete(() => resolve());
        });
    }

    dummy(time, props = {}) {
        return this.add({ value: 0 }, time, {
            ...props,
            easing: 'linear',
            to: { value: 1 },
        });
    }

    fadeIn(target, time = 300, props = {}) {
        target.alpha = 0;

        const tween = this.add(target, time, {
            ...props,
            to: { alpha: 1 },
        });

        if (props.autostart === false || props.delay) {
            tween.onStart(() => {
                target.alpha = 0;
            });
        }

        return tween;
    }

    fadeOut(target, time = 200, props = {}) {
        return this.add(target, time, {
            ...props,
            to: { alpha: 0 },
        });
    }

    // zoomIn(target, scaleFrom = 0, time = 300, props = {}) {
    //     const scaleTo = target.scale.x || 1;
    //     target.scale.set(scaleFrom);
    //     return this.add(target.scale, { x: scaleTo, y: scaleTo }, time, props);
    // }

    // zoomOut(target, scaleTo = 0, time = 300, props = {}) {
    //     return this.scale(target, scaleTo, time, props);
    // }

    pulse(target, time = 300, props = {}) {
        const scaleTo = props.scaleTo || 1.1;
        const s = target.scale;
        return this.add(target.scale, time, {
            ...props,
            yoyo: true,
            repeat: props.repeat || 1,
            to: { x: s.x * scaleTo, y: s.y * scaleTo },
        });
    }

    fadeIn3(target, time, props = {}) {
        if (!target.material) {
            let tween;
            traverseObject3D(target, (child) => {
                tween = this.fadeIn3(child, time, props);
            });
            return tween;
        }

        const finalOpacity = target.material.opacity || 1;
        target.material.transparent = true;
        target.material.opacity = 0;
        return this.add(target.material, time, {
            ...props,
            to: { opacity: finalOpacity },
        });
    }

    fadeOut3(target, time, props = {}) {
        if (!target.material) {
            let tween;
            traverseObject3D(target, (child) => {
                tween = this.fadeOut3(child, time, props);
            });
            return tween;
        }

        target.material.transparent = true;
        return this.add(target.material, time, {
            ...props,
            to: { opacity: 0 },
        });
    }

    zoomIn3(target, time, props = {}) {
        const { x: sx, y: sy, z: sz } = target.scale;
        const scaleFrom = props.scaleFrom;
        target.scale.multiplyScalar(scaleFrom);
        return this.add(target.scale, time, {
            ...props,
            to: { x: sx, y: sy, z: sz },
        });
    }

    pulse3(target, time = 300, props = {}) {
        const scaleTo = props.scaleTo || 1.1;
        const s = target.scale;
        return this.add(target.scale, time, {
            ...props,
            easing: 'cubic',
            yoyo: true,
            to: { x: s.x * scaleTo, y: s.y * scaleTo, z: s.z * scaleTo },
        });
    }

    switchColor3(target, color, time, props = {}) {
        const oldColor = new THREE.Color(target.material.color);
        const newColor = new THREE.Color(color);
        const tempColor = new THREE.Color();
        const dummyTween = this.dummy(time, { easing: 'sineIn', ...props });

        dummyTween.onUpdate((k) => {
            tempColor.copy(oldColor);
            tempColor.lerp(newColor, k.value);
            target.material.color.setHex(tempColor.getHex());
        });

        return dummyTween;
    }
}

function traverseObject3D(target, handler) {
    let tween;
    target.traverse((child) => {
        if (child.material) {
            tween = handler(child);
        }
    });
    return tween;
}

export const tweens = new TweensFactory();
