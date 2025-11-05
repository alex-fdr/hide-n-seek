import { GLTFLoader } from 'three/addons/loaders/GLTFLoader';
import * as SkeletonUtils from 'three/addons/utils/SkeletonUtils';

export class ModelLoader {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.storage = {};
        this.loader = new GLTFLoader();
    }

    loadAll(queue = []) {
        return Promise.allSettled(queue.map(this.load, this));
    }

    load({ key, file }) {
        return new Promise((resolve) => {
            this.loader.load(file, (data) => {
                resolve(data);
                this.storage[key] = {
                    model: data.scene,
                    animations: data.animations,
                };
            });
        });
    }

    get(key, name) {
        const { model } = this.storage[key];
        const mesh = name ? model.getObjectByName(name) : model;

        if (!mesh) {
            throw new Error(`no mesh named ${key} found`);
        }

        if (model.getObjectByProperty('type', 'SkinnedMesh')) {
            return SkeletonUtils.clone(mesh);
        }

        return mesh.clone();
    }

    getAnimation(key, index = 0) {
        return this.storage[key].animations[index];
    }

    getAnimations(key, commonNamePart) {
        const list = this.storage[key].animations;
        return commonNamePart
            ? list.filter((anim) => anim.name.includes(commonNamePart))
            : list;
    }
}
