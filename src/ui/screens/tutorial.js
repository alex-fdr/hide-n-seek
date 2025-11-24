import { Container, Text } from 'pixi.js';
import { config } from '../../data/config';
import { ROLE_HIDER } from '../../data/game-const';
import { locale } from '../../data/locale';
import { tweens } from '../../systems/tweens';

export class TutorialScreen {
    constructor({ parent, visible }) {
        const role = config.playerRole;
        const key = role === ROLE_HIDER ? 'tutorialHide' : 'tutorialSeek';
        const { text, fontSize } = locale[key];

        this.text = new Text({
            text,
            anchor: 0.5,
            style: {
                fontSize,
                fill: '#ffffff',
                fontFamily: 'gamefont',
                letterSpacing: 2,
                stroke: {
                    color: '#1c80e1',
                    width: 5,
                },
            },
        });

        this.group = new Container({
            parent,
            visible,
            label: 'tutorial',
            children: [this.text],
        });
    }

    show() {
        this.group.visible = true;
        tweens.fadeIn(this.group);
    }

    hide() {
        if (!this.group.visible) {
            return;
        }

        this.group.visible = false;
    }

    handlePortrait() {
        this.group.scale.set(1);
        this.text.position.set(0, 380);
    }

    handleLandscape(factor) {
        this.group.scale.set(factor);
        this.text.position.set(0, 380);
    }
}
