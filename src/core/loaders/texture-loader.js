import { TextureLoader as BaseTextureLoader, RepeatWrapping } from 'three';

export class TextureLoader {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
        this.storage = {};
        this.loader = new BaseTextureLoader();
    }

    loadAll(queue = []) {
        return Promise.allSettled(queue.map(this.load, this));
    }

    load({ key, file }) {
        return new Promise((resolve) => {
            this.loader.load(file, (data) => {
                resolve(data);
                this.storage[key] = data;
            });
        });
    }

    get(key, props = {}) {
        const {
            clone = false,
            flipY = false,
            repeatX = 0,
            repeatY = repeatX,
        } = props;

        let texture = this.storage[key];
        texture = clone ? texture.clone() : texture;
        texture.flipY = flipY;

        if (repeatX) {
            texture.repeat.set(repeatX, repeatY);
            texture.wrapS = RepeatWrapping;
            texture.wrapT = RepeatWrapping;
        }

        return texture;
    }
}
