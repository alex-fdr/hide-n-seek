import { Container, WebGLRenderer } from 'pixi.js';

class PixiUI {
    constructor() {
        this.renderer = new WebGLRenderer();
        this.stage = new Container();
        this.screens = new Map();
    }

    async init(threeRenderer, width, height) {
        await this.renderer.init({
            context: threeRenderer.getContext(),
            width,
            height,
            clearBeforeRender: false,
        });
    }

    resize(width, height) {
        const cx = width * 0.5;
        const cy = height * 0.5;
        const aspectRatio = width / height;
        const scaleFactor = 1 / aspectRatio;
        const method = cx > cy ? 'handleLandscape' : 'handlePortrait';

        // center coordinate system
        this.stage.position.set(cx, cy);

        for (const [, screen] of this.screens) {
            screen[method](cx, cy, scaleFactor);
        }

        this.renderer.resize(width, height);
    }

    render() {
        this.renderer.resetState();
        this.renderer.render(this.stage);
    }
}

export const pixiUI = new PixiUI();
