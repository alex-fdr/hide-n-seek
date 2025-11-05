import { factory } from '../helpers/pixi/pixi-factory';
import { tweens } from '../helpers/tweens';

export class TutorialScreen {
  constructor(visible) {
    const role = GM.config.get('player.role')
    const key = (role === 'hider') ? 'tutorialHide' : 'tutorialSeek'

    this.text = factory.text(key, {
      color: '#ffffff',
      stroke: '#1c80e1',
      strokeThickness: 5,
      letterSpacing: 2
    })

    this.group = factory.group([
      this.text,
    ], visible, 'tutorial')
  }

  show() {
    this.group.visible = true
    tweens.fadeIn(this.group)
  }

  hide() {
    if (!this.group.visible) {
      return
    }

    this.group.visible = false
  }

  orientationPortrait(cx, cy) {
    this.group.scale.set(1)
    this.group.position.set(cx, cy)
    this.text.position.set(0, 380)
  }

  orientationLandscape(cx, cy, factor) {
    this.group.scale.set(0.465 * factor)
    this.group.position.set(cx, cy)
    this.text.position.set(0, 380)
  }
}