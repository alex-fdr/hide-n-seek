import { Easing, Group, Tween } from '@tweenjs/tween.js';

const mapping = {
    'linear': Easing.Linear.None,

    'quad': Easing.Quadratic.InOut,
    'quadIn': Easing.Quadratic.In,
    'quadOut': Easing.Quadratic.Out,

    'cubic': Easing.Cubic.InOut,
    'cubicIn': Easing.Cubic.In,
    'cubicOut': Easing.Cubic.Out,

    'quar': Easing.Quartic.InOut,
    'quarIn': Easing.Quartic.In,
    'quarOut': Easing.Quartic.Out,

    'quint': Easing.Quintic.InOut,
    'quintIn': Easing.Quintic.In,
    'quintOut': Easing.Quintic.Out,

    'sine': Easing.Sinusoidal.InOut,
    'sineIn': Easing.Sinusoidal.In,
    'sineOut': Easing.Sinusoidal.Out,

    'exp': Easing.Exponential.InOut,
    'expIn': Easing.Exponential.In,
    'expOut': Easing.Exponential.Out,

    'circ': Easing.Circular.InOut,
    'circIn': Easing.Circular.In,
    'circOut': Easing.Circular.Out,

    'elastic': Easing.Elastic.InOut,
    'elasticIn': Easing.Elastic.In,
    'elasticOut': Easing.Elastic.Out,

    'back': Easing.Back.InOut,
    'backIn': Easing.Back.In,
    'backOut': Easing.Back.Out,

    'bounce': Easing.Bounce.InOut,
    'bounceIn': Easing.Bounce.In,
    'bounceOut': Easing.Bounce.Out,
};

class TweensFactory {
    constructor() {
        this.tweens = [];
        this.group = new Group;
    }

    add(target, data, time = 300, props = {}) {
        const {
            easing = 'sine',
            autostart = true,
            delay = 0,
            repeat = 0,
            repeatDelay = 0,
            yoyo = false,
        } = props;

        const tween = new Tween(target)
            .to(data, time)
            .easing(mapping[easing]);

        if (autostart) tween.start();
        if (repeatDelay) tween.repeatDelay(repeatDelay);
        if (yoyo && !repeat) tween.repeat(1);
        if (repeat === -1) tween.repeat(Infinity);

        this.tweens.push(tween);
        this.group.add(tween);
        return tween;
    }

    wait(time, delay = 0) {
        const from = { k: 0 };
        const to = { k: 1 };
        const t = this.add(from, to, time, {
            easing: 'linear',
            autostart: true,
            delay
        });
        return new Promise((resolve) => {
            t.onComplete(() => resolve());
        });
    }

    remove(tween) {
        this.group.remove(tween);
        this.tweens.splice(this.tweens.indexOf(tween), 1);
    }

    pause() {
        this.tweens.forEach(tween => tween.pause());

    }

    resume() {
        this.tweens.forEach(tween => tween.resume());
    }

    update(time) {
        this.group.update(time);
    }

    // fadeIn(target, time = 300, props = {}) {
    //     target.alpha = 0;

    //     const tween = this.add(target, { alpha: 1 }, time, props);

    //     if (props.autostart === false || props.delay) {
    //         tween.onStart(() => {
    //             target.alpha = 0;
    //         });
    //     }

    //     return tween;
    // }

    // fadeOut(target, time = 200, props = {}) {
    //     return this.add(target, { alpha: 0 }, time, props);
    // }

    // zoomIn(target, scaleFrom = 0, time = 300, props = {}) {
    //     const scaleTo = target.scale.x || 1;
    //     target.scale.set(scaleFrom);
    //     return this.add(target.scale, { x: scaleTo, y: scaleTo }, time, props);
    // }

    // zoomOut(target, scaleTo = 0, time = 300, props = {}) {
    //     return this.scale(target, scaleTo, time, props);
    // }

    // pulse(target, scaleTo = 1.1, time = 300, props = {}) {
    //     props.repeat = props.repeat || 1;
    //     props.yoyo = true;
    //     const to = { x: target.scale.x * scaleTo, y: target.scale.y * scaleTo };
    //     return this.add(target.scale, to, time, props);
    // }

    // scale(target, scaleTo, time, props) {
    //     const to = { x: scaleTo, y: scaleTo };
    //     return this.add(target.scale, to, time, props);
    // }

    // timeout(time = 1000, callback = () => { }) {
    //     const dummy = { value: 0 };
    //     const tween = this.add(dummy, { value: 1 }, time, { easing: 'linear' });
    //     if (callback && typeof callback === 'function') {
    //         tween.onComplete(() => callback());
    //     }
    //     return tween;
    // }

    dummy(time, props = {}) {
        return this.add({ value: 0 }, { value: 1 }, time, { easing: 'linear', ...props });
    }

    // float(target, data, time = 300, props = {}) {
    //     const from = {
    //         x: target.x,
    //         y: target.y,
    //     };
    //     const to = {
    //         x: target.x + data.x || 0,
    //         y: target.y + data.y || 0,
    //     };
    //     const tween = this.add(target, to, time, props).yoyo(true);
    //     const tweenBack = this.add(target, from, 200, { ...props, autostart: false });
    //     tween.onComplete(() => {
    //         tweenBack.start();
    //     });
    //     return tween;
    // }

    // moveSideToSide(target, data = {}, time = 300, props = {}) {
    //     const {
    //         x: dx = 0,
    //         y: dy = 0,
    //         left = 0,
    //         right = 0,
    //     } = data;
    //     const from = {
    //         x: right || target.x - dx,
    //         y: target.y - dy,
    //     };
    //     const to = {
    //         x: left || target.x + dx,
    //         y: target.y + dy,
    //     };
    //     let tween = this.add(target, from, time * 0.5)
    //         .onComplete(() => {
    //             tween = this.add(target, to, time, props).yoyo(true).repeat(Infinity);
    //         });
    //     return tween;
    // }

    // moveCircle(target, data, time = 300, props = {}) {
    //     let {
    //         startAngle = 0,
    //         endAngle = 360,
    //         radius = 1,
    //     } = data;

    //     startAngle *= Math.PI / 180;
    //     endAngle *= Math.PI / 180;

    //     const startX = target.x;
    //     const startY = target.y;
    //     const range = endAngle - startAngle;

    //     const moveTarget = (angle) => {
    //         target.x = startX + Math.cos(angle) * radius - radius * Math.cos(startAngle);
    //         target.y = startY - Math.sin(angle) * radius + radius * Math.sin(startAngle);
    //     };

    //     const dummy = { value: 0 };
    //     const tween = this.add(dummy, { value: 1 }, time, { easing: 'sineInOut', ...props });
    //     tween.onStart(() => moveTarget(startAngle));
    //     tween.onUpdate(() => moveTarget(startAngle + range * dummy.value));
    //     tween.onComplete(() => moveTarget(endAngle));
    //     return tween;
    // }

    // shake(target, data, time = 300, props = {}) {
    //     if (target.isShaking) {
    //         return false;
    //     }

    //     // Its a dirty hack. Maybe there is a better solution
    //     target.isShaking = true;

    //     const { x, y, angle } = target;
    //     const obj = { x, y, angle };

    //     if (data.x) obj.x += data.x;
    //     if (data.y) obj.y += data.y;
    //     if (data.angle) obj.angle += data.angle;

    //     // eslint-disable-next-line no-use-before-define
    //     props.easing = (k) => wiggle(k, 1, 1);

    //     const tween = this.add(target, obj, time, props);
    //     tween.onComplete(() => {
    //         target.position.set(x, y);
    //         target.angle = angle;
    //         target.isShaking = false;
    //     });

    //     return tween;
    // }

    fadeIn3(target, time, props = {}) {
        if (!target.material) {
            let tween;
            traverseObject3D(target, (child) => {
                tween = this.fadeIn3(child, time, props);
            });
            return tween;
        }

        const opacity = target.material.opacity || 1;
        target.material.transparent = true;
        target.material.opacity = 0;
        return this.add(target.material, { opacity }, time, props);
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
        return this.add(target.material, { opacity: 0 }, time, props);
    }

    zoomIn3(target, scaleFrom, time, props = {}) {
        const { x: sx, y: sy, z: sz } = target.scale;
        target.scale.multiplyScalar(scaleFrom);
        return this.add(target.scale, { x: sx, y: sy, z: sz }, time, props);
    }

    pulse3(target, scaleTo = 1.1, time = 300, props = {}) {
        return this.add(target.scale, {
            x: target.scale.x * scaleTo,
            y: target.scale.y * scaleTo,
            z: target.scale.z * scaleTo
        }, time, {
            easing: 'cubic',
            yoyo: true,
            ...props,
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
        // return this.add(target.material, { color }, time, props)
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

// function wiggle(aProgress, aPeriod1, aPeriod2) {
//     const current1 = aProgress * Math.PI * 2 * aPeriod1;
//     const current2 = aProgress * (Math.PI * 2 * aPeriod2 + Math.PI / 2);
//     return Math.sin(current1) * Math.cos(current2);
// }

export const tweens = new TweensFactory();
