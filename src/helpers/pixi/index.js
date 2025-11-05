import * as PIXI from 'pixi.js';
import { factory } from './pixi-factory';
import { screens } from './pixi-screens';

class PixiUI {
  constructor() {
    this.loaded = false;
    this.resources = null;
  }

  init(callback, renderCanvas) {
    this.loadTextures(() => {
      factory.init(this.resources);
      screens.init(this.app.stage);
      callback();
    });
    this.createPixiInstance(renderCanvas);
  }

  setLevel(level) {
    this.level = level;
  }

  loadTextures(callback) {
    const loader = new PIXI.Loader();
    Object.keys(RES.images).forEach((k) => loader.add(k, RES.images[k]));
    loader.onComplete.add(() => {
      this.loaded = true;
      this.onLoaded(loader);
      callback();
    });
    loader.load();
  }

  onLoaded(loader) {
    this.resources = loader.resources;
    // this.add.init(this.resources);
  }

  createPixiInstance(renderCanvas) {
    PIXI.settings.PREFER_ENV = PIXI.ENV.WEBGL1
    
    this.app = new PIXI.Application({
      width: 960,
      height: 960,
      backgroundColor: 0x000000,
      resolution: 1,
      antialias: true,
      transparent: true,
    });

    this.app.view.id = 'pixi-canvas';
    this.app.view.style.setProperty('pointer-events', 'none');
    document.body.appendChild(this.app.view);

    if (renderCanvas) {
      this.app.renderer.plugins.interaction.setTargetElement(renderCanvas);
    }

    PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
    return this.app;
  }

  resize(displaySettings) {
    this.displaySettings = displaySettings;

    if (!this.app) {
      return;
    }

    this.app.renderer.resize(displaySettings.srcWidth, displaySettings.srcHeight);
    this.app.renderer.view.style.width = '100vw';
    this.app.renderer.view.style.height = '100vh';

    const cx = displaySettings.srcWidth / 2;
    const cy = displaySettings.srcHeight / 2;

    const maxAspectRatioInLandscape = 2.165; // iphonex ratio
    const factor = maxAspectRatioInLandscape / (cx / cy);

    if (cx < cy) {
      screens.orientationPortrait(cx, cy);
    } else {
      screens.orientationLandscape(cx, cy, factor);
    }
  }
}

export const pixiUI = new PixiUI();
