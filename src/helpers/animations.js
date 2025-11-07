import { AnimationMixer, LoopOnce, LoopRepeat } from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils';

import { assets } from '../core/assets';

class AnimationManager {
    constructor() {
        this.mixers = [];
        this.animationsList = [];
        this.targetsUuid = [];
        // this.currentAnimation = null;
        this.isActive = true;
    }

    init() {}

    add(targetMesh, animationSource, loop = false, timeScale = 1) {
        const mixer = this.addMixer(targetMesh);
        const anim = mixer.clipAction(animationSource);
        anim.timeScale = timeScale;
        anim.clampWhenFinished = true;
        anim.targetUuid = targetMesh.uuid;
        anim.setLoop(loop ? LoopRepeat : LoopOnce);
        this.animationsList.push(anim);
        return anim;
    }

    addMixer(target) {
        let mixer;
        if (this.targetsUuid.indexOf(target.uuid) === -1) {
            this.targetsUuid.push(target.uuid);
            mixer = new AnimationMixer(target);
            this.mixers[target.uuid] = mixer;
        } else {
            mixer = this.mixers[target.uuid];
        }
        return mixer;
    }

    play(anim) {
        if (anim) {
            anim.getMixer().stopAllAction();
            anim.play();
        }
    }

    playWithCrossFade(nextAnim, prevAnim, durationInSeconds = 0.2) {
        prevAnim.crossFadeTo(nextAnim, durationInSeconds);
        nextAnim.play();
    }

    stop(anim) {
        if (anim) {
            anim.stop();
            // anim.getMixer().stopAllAction();
        }
    }

    onComplete(anim, callback, once = true) {
        const mixer = anim.getMixer();

        const handler = () => {
            if (once) {
                mixer.removeEventListener('finished', handler);
            }

            if (callback) {
                callback();
            }
        };

        mixer.addEventListener('finished', handler);
    }

    disable() {
        this.isActive = false;
    }

    update(dt) {
        if (!this.isActive) {
            return;
        }

        for (const uuid of this.targetsUuid) {
            this.mixers[uuid].update(dt);
        }
        // this.targetsUuid.forEach((uuid) => this.mixers[uuid].update(dt));
    }

    parse(animationsMap) {
        const result = {
            mesh: null,
            animationsMap: {},
            animationsList: [],
            keys: [],
        };

        animationsMap.forEach(({ key }) => {
            const base = assets.models.get(key);
            const isFbx = base.type === 'Group';
            const model = isFbx ? base : base.scene.children[0];
            const typeToCheck = isFbx ? 'SkinnedMesh' : 'Bone';

            if (model.getObjectByProperty('type', typeToCheck)) {
                result.mesh = SkeletonUtils.clone(model);
            }
        });

        animationsMap.forEach(
            ({ key, name = key, loop = false, timeScale = 1, clipId = 0 }) => {
                const anims = assets.models.getAnimations(key);

                if (anims.length) {
                    const anim = this.add(
                        result.mesh,
                        anims[clipId],
                        loop,
                        timeScale,
                    );
                    result.animationsMap[name] = anim;
                    result.animationsList.push(anim);
                    result.keys.push(name);
                }
            },
        );

        return result;
    }
}

export const animations = new AnimationManager();
