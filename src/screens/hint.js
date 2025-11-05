import { factory } from '../helpers/pixi/pixi-factory'
import { tweens } from '../helpers/tweens'
import { InfinityHint } from '../helpers/ui/hints/infinity-hint'

export class HintScreen {
  constructor(visible) {
    this.hint = new InfinityHint({
      time: 1300,
      baseKey: 'infinity-sign',
      pointerKey: 'pointer',
      amplitudeX: 195,
      amplitudeY: 90,
      offsetX: 30,
      offsetY: 45,
    })

    this.status = {
      animated: false
    }
    
    this.group = factory.group([this.hint.group], visible)
  }

  show() {
    this.group.visible = true

    if (!this.status.animated) {
      this.status.animated = true
      this.animate()
    } 
  }
  
  hide() {
    this.group.visible = false
  }

  animate() {
    tweens.fadeIn(this.group, 300)
    this.hint.animate()
  }

  orientationPortrait(cx, cy) {
    this.group.scale.set(1)
    this.group.position.set(cx, cy)
    this.hint.setPosition(0, 225)
  }

  orientationLandscape(cx, cy, factor) {
    this.group.scale.set(0.465 * factor)
    this.group.position.set(cx, cy)
    this.hint.setPosition(0, 225)
  }

  setPosition(x, y) {
    this.pointerOld.position.set(x, y)
  }
}