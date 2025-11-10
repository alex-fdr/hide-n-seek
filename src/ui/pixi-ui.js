import { Container, Text, WebGLRenderer } from 'pixi.js';
import { loadAssets } from './pixi-assets';
import { PixiScreens } from './pixi-screens';

class PixiUI {
    constructor() {
        this.renderer = new WebGLRenderer();
        this.stage = new Container();
        this.screens = new PixiScreens(this.stage);
    }

    async init(threeRenderer, width, height) {
        await this.renderer.init({
            context: threeRenderer.getContext(),
            width,
            height,
            clearBeforeRender: false,
        });

        await loadAssets();
    }

    resize(width, height) {
        this.renderer.resize(width, height);

        const cx = width * 0.5;
        const cy = height * 0.5;
        const maxAspectRatioInLandscape = 2.165; // iphonex ratio
        const factor = maxAspectRatioInLandscape / (cx / cy);

        if (cx > cy) {
            this.screens.handleLandscape(cx, cy, factor);
        } else {
            this.screens.handlePortrait(cx, cy);
        }
    }

    render() {
        this.renderer.resetState();
        this.renderer.render(this.stage);
    }
}

export const pixiUI = new PixiUI();
