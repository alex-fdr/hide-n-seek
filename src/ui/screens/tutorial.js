import { Container, Text } from 'pixi.js';
import { tweens } from '../../helpers/tweens';
import config from '../../assets/settings/config';
import { ROLE_HIDER } from '../../data/game-const';
import { locale } from '../../data/locale';

export class TutorialScreen {
    constructor(visible) {
        const role = config.player.role.value;
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

    handlePortrait(cx, cy) {
        this.group.scale.set(1);
        this.group.position.set(cx, cy);
        this.text.position.set(0, 380);
    }

    handleLandscape(cx, cy, factor) {
        this.group.scale.set(0.465 * factor);
        this.group.position.set(cx, cy);
        this.text.position.set(0, 380);
    }
}
