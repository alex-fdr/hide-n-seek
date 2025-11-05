import * as PIXI from 'pixi.js';

class PixiFactory {
  init(resources) {
    this.resources = resources;
  }

  sprite(key) {
    const sprite = new PIXI.Sprite(this.resources[key].texture);
    sprite.anchor.set(0.5);
    return sprite;
  }

  text(key, style = {}) {
    const { text, size: fontSize } = GM.l10n.get(key);
    // const [fontSize, fontFamily] = font.split(' ');
    // const [fontSize, fontFamily] = font.split(' ');
    const el = new PIXI.Text(text, {
      ...style,
      fontFamily: 'gamefont',
      fontSize: fontSize || '24px',
      fill: style.fill || style.color || '#fff',
      align: 'center',
      stroke: style.stroke || '#000',
      strokeThickness: style.strokeThickness || 0,
    });
    el.anchor.set(0.5);
    return el;
  }

  textOld(string, font, fill, strokeColor, strokeThickness) {
    const [fontSize, fontFamily] = font.split(' ');
    const text = new PIXI.Text(string, {
      fontFamily: fontFamily || 'gamefont',
      fontSize: fontSize || '24px',
      fill: fill || '#fff',
      align: 'center',
      stroke: strokeColor || '#000',
      strokeThickness: strokeThickness || 0,
    });
    text.anchor.set(0.5);
    return text;
  }

  tilesprite(key, width = 960, height = 960) {
    const sprite = new PIXI.TilingSprite(this.resources[key].texture, width, height);
    sprite.anchor.set(0.5);
    return sprite;
  }

  group(children = [], visible = true, name = '') {
    const group = new PIXI.Container();
    group.visible = visible;
    group.name = name;
    if (!children || children.length === 0) {
      return group;
    }
    group.addChild(...children);
    return group;
  }

  pixiGraphics() {
    return new PIXI.Graphics();
  }

  animatedSprite(props = {}) {
    const { key } = props;
    const { speed = 0.25, loopDelay = 0, loop = true, autostart = true, yoyo = false } = props;
    const { from, to, digits } = props.frames || { from: 1, to: 1, digits: 2 };
    
    const names = this.generateFrameNames(key, from, to, digits, yoyo, props.remapFrames);
    const textures = names.map((name) => this.resources[name].texture);
    const sprite = new PIXI.AnimatedSprite(textures);
    sprite.anchor.set(0.5);

    if (speed) {
      sprite.animationSpeed = speed;
    }

    if (loop) {
      sprite.loop = true;

      if (loopDelay) {
        sprite.loop = false;
        sprite.onComplete = () => setTimeout(() => sprite.gotoAndPlay(0), loopDelay);
      }
    } else {
      sprite.loop = false;
    }

    if (autostart) {
      sprite.play();
    }

    return sprite;
  }

  generateFrameNames(name, from = 1, to = 1, digits = 2, yoyo = false, remapFrames = {}) {
    const names = [];
    const zeroPrefix = new Array(digits).join('0');
    const zeroPrefix10 = new Array(digits - 1).join('0');

    const remapKeys = Object.keys(remapFrames);
    const remapValues = Object.keys(remapFrames).map((key) => remapFrames[key]);

    const getRemappedFrame = (frameIndex) => {
      for (let i = 0; i < remapValues.length; i++) {
        if (remapValues[i].indexOf(frameIndex) !== -1) {
          return remapKeys[i];
        }
      }
      return frameIndex;
    };

    for (let i = from; i <= to; i++) {
      const suffix = i < 10 ? zeroPrefix : zeroPrefix10;
      const index = getRemappedFrame(i);
      const key = `${name}${suffix}${index}`;
      names.push(key);
    }

    if (yoyo) {
      return names.concat([...names].reverse());
    }
    
    return names;
  }

  textShadow(text, color = 0xffffff, alpha = 0.9, distance = 5, angle = 90) {
    text.style.dropShadow = true;
    text.style.dropShadowColor = color;
    text.style.dropShadowAlpha = alpha;
    text.style.dropShadowDistance = distance;
    text.style.dropShadowAngle = angle * (Math.PI / 180);
    return text;
  }

  setTexture(sprite, key) {
    sprite.texture = this.resources[key].texture;
  }
}

export const factory = new PixiFactory();
