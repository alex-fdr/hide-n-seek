import { tweens } from '@alexfdr/three-game-components';
import { Container } from 'pixi.js';
import { Timer } from '../components/timer';
import { config } from '../../data/config';

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

    handlePortrait() {
        this.group.scale.set(1);
        this.timer.setPosition(0, -380);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.timer.setPosition(0, -380);
    }
}
