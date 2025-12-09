import { tweens } from '@alexfdr/three-game-components';
import { SightRange } from '../sight-range';
import { Enemy } from './enemy';
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

    tutorialAnimation() {
        // rotate head around
        const el = this.group.getObjectByName('mixamorig_Spine2');
        const time = 2000;

        this.tutorialTween = tweens.add(el.rotation, time * 0.5, {
            to: { y: -1 },
            delay: 1000,
            onComplete: () => {
                this.tutorialTween = tweens.add(el.rotation, time, {
                    to: { y: 1 },
                    repeat: Infinity,
                    yoyo: true,
                    repeatDelay: 500,
                    easing: 'sineInOut',
                });
            },
        });
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
