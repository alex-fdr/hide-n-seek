import { factory } from '../helpers/pixi/pixi-factory';
import { tweens } from '../helpers/tweens';
// import { TextCounter } from '../helpers/ui/text-counter';
import { Timer } from '../helpers/ui/timer';

export class UIScreen {
  constructor(visible) {
    this.group = factory.group([], visible, 'ui')

    this.addTimer()
  } 

  addTimer() {
    const value = GM.config.get('timer.duration') || 10
    this.timer = new Timer(value)
    this.group.addChild(this.timer.group)
  }

  show() {
    if (this.group.visible) {
      return
    }

    this.group.visible = true
    tweens.fadeIn(this.group)
  }

  hide() {
    this.group.visible = false
  }

  orientationPortrait(cx, cy) {
    this.group.scale.set(1)
    this.group.position.set(cx, cy)
    this.timer.setPosition(0, -380)
  }

  orientationLandscape(cx, cy, factor) {
    this.group.scale.set(0.465 * factor)
    this.group.position.set(cx, cy)
    this.timer.setPosition(0, -380)
  }
}