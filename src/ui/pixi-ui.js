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

    addScreen(name, screen) {
        this.screens.set(name, screen);
        this.stage.addChild(screen.group);
    }

    showScreen(name) {
        this.screens.get(name)?.show();
        console.log('show screen', name);
        console.log(this.screens);
    }

    hideScreen(name) {
        this.screens.get(name)?.hide();
    }

    getScreen(name) {
        return this.screens.get(name);
    }

    resize(width, height) {
        console.log(width, height);
        const cx = width * 0.5;
        const cy = height * 0.5;
        // const maxAspectRatioInLandscape = 2.165; // iphonex ratio
        // const factor = maxAspectRatioInLandscape / (cx / cy);
        const factor = 1;
        const method = cx > cy ? 'handleLandscape' : 'handlePortrait';

        // center coordinate system
        this.stage.position.set(cx, cy);

        for (const [, screen] of this.screens) {
            screen[method](cx, cy, factor);
        }

        this.renderer.resize(width, height);
    }

    render() {
        this.renderer.resetState();
        this.renderer.render(this.stage);
    }
}

export const pixiUI = new PixiUI();
