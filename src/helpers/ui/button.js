import { factory } from '../../helpers/pixi/pixi-factory'
import { tweens } from '../../helpers/tweens'

export class Button {
  constructor(spriteKey, textKey, textStyle) {
    this.sprite = factory.sprite(spriteKey)
    this.text = factory.text(textKey, textStyle)
    this.group = factory.group([this.sprite, this.text])
  }

  getPosition() {
    return this.group.position    
  }

  setPosition(x = 0, y = 0) {
    this.group.position.set(x, y)
  }

  setScale(sx = 1, sy = sx) {
    this.group.scale.set(sx, sy)
  }

  setInputHandler(handler) {
    this.sprite.interactive = true
    this.sprite.once('pointerup', handler)
  }

  showPressEffect() {
    this.tween = tweens.pulse(this.group, 0.9, 300)
  }
}
