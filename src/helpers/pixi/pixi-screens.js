class PixiScreenManager {
  constructor() {
    this.layers = {};
  }

  init(pixiStage) {
    this.pixiStage = pixiStage;
  }

  addMultiple(screens) {
    Object.keys(screens).forEach((key) => {
      this.add(key, screens[key]);
    });
  }

  add(name, layer, makePublic = true) {
    this.pixiStage.addChild(layer.group);
    this.layers[name] = layer;
    if (makePublic) {
      this[name] = layer;
    }
  }

  get(layerName) {
    return this.layers[layerName];
  }

  show(layerName) {
    if (this.get(layerName)) {
      this.get(layerName).show();
    }
  }

  hide(layerName) {
    if (this.get(layerName)) {
      this.get(layerName).hide();
    }
  }

  orientationPortrait(cx, cy) {
    Object.keys(this.layers).forEach((name) => {
      if (this.layers[name].orientationPortrait) {
        this.layers[name].orientationPortrait(cx, cy);
      }
    });
  }

  orientationLandscape(cx, cy, factor) {
    Object.keys(this.layers).forEach((name) => {
      if (this.layers[name].orientationLandscape) {
        this.layers[name].orientationLandscape(cx, cy, factor);
      }
    });
  }
}

export const screens = new PixiScreenManager();
