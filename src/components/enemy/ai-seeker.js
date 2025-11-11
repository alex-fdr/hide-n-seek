import { SightRange } from '../sight-range';
import { Enemy } from './enemy';
import { tweens } from '../../helpers/tweens';
import { ROLE_SEEKER } from '../../data/game-const';

export class AISeeker extends Enemy {
    constructor(props) {
        super(props);

        this.role = ROLE_SEEKER;
        this.sightRange = this.addSightRange();
    }

    addSightRange() {
        return new SightRange({ parent: this.group });
    }

    updateSightRange(walls, enemies, player) {
        this.sightRange?.update(walls, enemies, player);
    }

    tutorialAnimation() {
        // rotate head around
        const el = this.group.getObjectByName('mixamorig_Spine2');
        const time = 1000;
        const props = {
            repeat: -1,
            yoyo: true,
            repeatDelay: 500,
            easing: 'sineInOut',
        };
        const t = tweens.add(el.rotation, time * 0.5, {
            to: { y: -1 },
            onComplete: () => {
                t2.start();
                this.tutorialTween = t2;
            },
        });
        const t2 = tweens.add(el.rotation, time, {
            ...props,
            autostart: false,
            to: { y: 1 },
        });
        this.tutorialTween = t;
    }

    activate() {
        super.activate();

        if (this.tutorialTween) {
            this.tutorialTween.stop(true);
            this.tutorialTween = null;
        }
    }

    // update(dt) {
    //   super.update(dt)
    // }
}
