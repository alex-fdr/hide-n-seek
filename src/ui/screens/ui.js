// import { TextCounter } from '../helpers/ui/text-counter';
import { Timer } from '../components/timer';
import { tweens } from '../../helpers/tweens';
import { factory } from '../pixi-factory';
import config from '../../assets/settings/config';

export class UIScreen {
    constructor(visible) {
        this.group = factory.group([], visible, 'ui');

        this.addTimer();
    }

    addTimer() {
        const value = config.timer.duration.value || 10;
        this.timer = new Timer(value);
        this.group.addChild(this.timer.group);
    }

    show() {
        if (this.group.visible) {
            return;
        }

        this.group.visible = true;
        tweens.fadeIn(this.group);
    }

    hide() {
        this.group.visible = false;
    }

    handlePortrait(cx, cy) {
        this.group.scale.set(1);
        this.group.position.set(cx, cy);
        this.timer.setPosition(0, -380);
    }

    handleLandscape(cx, cy, factor) {
        this.group.scale.set(0.465 * factor);
        this.group.position.set(cx, cy);
        this.timer.setPosition(0, -380);
    }
}
