import { tweens } from '../../helpers/tweens';
import { factory } from '../pixi-factory';
import config from '../../assets/settings/config';

export class TutorialScreen {
    constructor(visible) {
        const role = config.player.role.value;
        const key = role === 'hider' ? 'tutorialHide' : 'tutorialSeek';

        this.text = factory.text(key, {
            fill: '#ffffff',
            stroke: {
                color: '#1c80e1',
                width: 5,
            },
            letterSpacing: 2,
        });

        this.group = factory.group([this.text], visible, 'tutorial');
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
