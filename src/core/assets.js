import { ModelLoader } from './loaders/model-loader';
import { TextureLoader } from './loaders/texture-loader';

class AssetsSystem {
    constructor() {
        // this.sounds = {};
        this.models = new ModelLoader('./src/assets/models/');
        this.textures = new TextureLoader('./src/assets/textures/');
    }

    async load({ models, textures }) {
        await Promise.allSettled([
            this.models.loadAll(models),
            this.textures.loadAll(textures),
        ]);

        console.log('MODELS:', this.models.storage);
        console.log('TEXTURES:', this.textures.storage);
    }
}

export const assets = new AssetsSystem();
