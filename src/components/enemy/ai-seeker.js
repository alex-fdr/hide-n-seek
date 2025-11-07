import { tweens } from '../../helpers/tweens';
import { ROLE_SEEKER } from '../../models/game-const';
import { SightRange } from '../sight-range';
import { Enemy } from './enemy';

export class AISeeker extends Enemy {
    constructor(props) {
        super(props);

        this.role = ROLE_SEEKER;
    }

    init() {
        super.init();

        this.addSightRange();
    }

    addSightRange() {
        this.sightRange = new SightRange();
        this.sightRange.init(this.group);
    }

    updateSightRange(walls, enemies, player) {
        this.sightRange?.update(walls, enemies, player);
    }

    tutorialAnimation() {
        // rotate head around
        const el = this.group.getObjectByName('mixamorig_Spine2');
        // const el = this.group
        const time = 1000;
        const props = {
            repeat: -1,
            yoyo: true,
            repeatDelay: 500,
            easing: 'sineInOut',
        };
        const t = tweens.add(el.rotation, { y: -1 }, time * 0.5);
        const t2 = tweens.add(el.rotation, { y: 1 }, time, {
            ...props,
            autostart: false,
        });
        this.tutorialTween = t;

        t.onComplete(() => {
            t2.start();
            this.tutorialTween = t2;
        });
    }

    activate() {
        super.activate();

        if (this.tutorialTween) {
            console.log('stop tween');
            this.tutorialTween.stop(true);
            this.tutorialTween = null;
        }
    }

    // update(dt) {
    //   super.update(dt)
    // }
}
