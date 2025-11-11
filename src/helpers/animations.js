import { assets } from '@alexfdr/three-game-core';
import { AnimationMixer, LoopOnce, LoopRepeat } from 'three';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils';

class AnimationManager {
    constructor() {
        this.mixers = [];
        this.animationsList = [];
        this.targetsUuid = [];
        this.enabled = true;
    }

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
        if (!this.targetsUuid.includes(target.uuid)) {
            this.targetsUuid.push(target.uuid);
            this.mixers[target.uuid] = new AnimationMixer(target);
        }

        return this.mixers[target.uuid];
    }

    onAnimationComplete(anim, callback, once = true) {
        const mixer = anim.getMixer();

        const handler = () => {
            if (once) {
                mixer.removeEventListener('finished', handler);
            }

            callback?.();
        };

        mixer.addEventListener('finished', handler);
    }

    update(dt) {
        if (!this.enabled) {
            return;
        }

        for (const uuid of this.targetsUuid) {
            this.mixers[uuid].update(dt);
        }
    }

    parse(animationsMap) {
        const result = {
            mesh: null,
            animationsMap: {},
            animationsList: [],
            keys: [],
        };

        for (const { key } of animationsMap) {
            const base = assets.models.get(key);
            const hasRootGroup = base.type === 'Group';
            const model = hasRootGroup ? base : base.scene.children[0];
            const typeToCheck = hasRootGroup ? 'SkinnedMesh' : 'Bone';

            if (model.getObjectByProperty('type', typeToCheck)) {
                result.mesh = SkeletonUtils.clone(model);
            }
        }

        for (const props of animationsMap) {
            const { key, name = key, loop, timeScale, clipId = 0 } = props;
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
        }

        return result;
    }
}

export const animations = new AnimationManager();
