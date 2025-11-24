import { Container } from 'pixi.js';
import { Timer } from '../components/timer';
import { config } from '../../data/config';
import { tweens } from '../../systems/tweens';

export class UIScreen {
    constructor({ parent, visible }) {
        this.group = new Container({
            parent,
            visible,
            label: 'ui',
            children: [],
        });

        this.addTimer();
    }

    addTimer() {
        const value = config.timerDuration || 10;
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
        this.timer.setPosition(0, -380);
    }

    handleLandscape(cx, cy, factor) {
        this.group.scale.set(factor);
        this.timer.setPosition(0, -380);
    }
}
