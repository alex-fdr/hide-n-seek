import { tweens } from '../../helpers/tweens';
import { SightRange } from '../sight-range';
import { Enemy } from './enemy';

export class AISeeker extends Enemy {
    constructor() {
        super();

        this.role = 'seeker';
    }

    init(parent, enemiesData, aiSeekerData) {
        super.init(parent, enemiesData);

        this.addSightRange();
    }

    addSightRange() {
        const range = new SightRange();
        range.init(this.group);
        this.sightRange = range;
    }

    updateSightRange(walls, enemies, player) {
        if (this.sightRange) {
            this.sightRange.update(walls, enemies, player);
        }
    }

    tutorialAnimation() {
        // rotate head around
        const el = this.group.getObjectByName('mixamorig_Spine2');
        // const el = this.group
        const time = 1000;
        const props = { repeat: -1, yoyo: true, repeatDelay: 500, easing: 'sineInOut' };
        const t = tweens.add(el.rotation, { y: -1 }, time * 0.5);
        const t2 = tweens.add(el.rotation, { y: 1 }, time, { ...props, autostart: false });
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