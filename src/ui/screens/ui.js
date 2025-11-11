import { Container } from 'pixi.js';
import { Timer } from '../components/timer';
import { tweens } from '../../helpers/tweens';
import config from '../../assets/settings/config';

export class UIScreen {
    constructor(visible) {
        this.group = new Container({
            visible,
            label: 'ui',
            children: [],
        });

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
        this.timer.setPosition(0, -cy + 100);
    }

    handleLandscape(cx, cy) {
        this.timer.setPosition(0, -cy + 70);
    }
}
