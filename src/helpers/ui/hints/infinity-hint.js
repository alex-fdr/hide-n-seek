import { factory } from '../../pixi/pixi-factory'
import { tweens } from '../../tweens'

export class InfinityHint {
  constructor(props) {
    this.enabled = true

    this.halfAmplitudeX = props.amplitudeX ? Math.floor(props.amplitudeX / 2) : 116
    this.halfAmplitudeY = props.amplitudeY ? Math.floor(props.amplitudeY / 2) : 46
    this.time = props.time || 2000
    this.offsetX = props.offsetX || 0
    this.offsetY = props.offsetY || 0

    this.infinity = factory.sprite(props.baseKey || 'infinity')
    
    // idea - apply offset to hand
    
    this.pointer = factory.sprite(props.pointerKey || 'pointer')
    // this.pointer.anchor.x = 0.05
    this.pointer.scale.set(props.pointerScale || 1)
    this.pointer.position.set(this.offsetX, this.offsetY)

    this.pointerGroup = factory.group([this.pointer])
    
    this.group = factory.group([
      this.infinity, 
      this.pointerGroup
    ], props.visible, 'infinity-hint')

    // this.group.visible = props.visible || false

    // tween props
    this.propsIn = { easing: 'sineIn' }
    this.propsOut = { easing: 'sineOut' }
  }

  show() {
    if (!this.enabled) {
      return
    }

    this.group.visible = true
    tweens.fadeIn(this.group, 300)
  }

  hide() {
    tweens.fadeOut(this.group, 200).onComplete(() => {
      this.group.visible = false
    })
  }

  setPosition(x, y) {
    this.group.position.set(x, y)
  }

  animate() {
    this.animatePointerRightFrom9to12()
  }

  animatePointerRightFrom9to12() {
    this.tweenX = tweens.add(this.pointerGroup, { x: this.halfAmplitudeX }, this.time * 0.5, this.propsOut)
    this.tweenY = tweens.add(this.pointerGroup, { y: -this.halfAmplitudeY }, this.time * 0.25, this.propsOut)
    this.tweenY.onComplete(() => this.animatePointerRightFrom12to3())
  }

  animatePointerRightFrom12to3() {
    this.tweenY = tweens.add(this.pointerGroup, { y: 0 }, this.time * 0.25, this.propsIn)
    this.tweenY.onComplete(() => this.animatePointerRightFrom3to6())
  }

  animatePointerRightFrom3to6() {
    this.tweenX = tweens.add(this.pointerGroup, { x: 0 }, this.time * 0.5, this.propsIn)
    this.tweenY = tweens.add(this.pointerGroup, { y: this.halfAmplitudeY }, this.time * 0.25, this.propsOut)
    this.tweenY.onComplete(() => this.animatePointerRightFrom6to9())
  }

  animatePointerRightFrom6to9() {
    this.tweenY = tweens.add(this.pointerGroup, { y: 0 }, this.time * 0.25, this.propsIn)
    this.tweenY.onComplete(() => this.animatePointerLeftFrom3to12())
  }

  animatePointerLeftFrom3to12() {
    this.tweenX = tweens.add(this.pointerGroup, { x: -this.halfAmplitudeX }, this.time * 0.5, this.propsOut)
    this.tweenY = tweens.add(this.pointerGroup, { y: -this.halfAmplitudeY }, this.time * 0.25, this.propsOut)
    this.tweenY.onComplete(() => this.animatePointerLeftFrom12to9())
  }

  animatePointerLeftFrom12to9() {
    this.tweenY = tweens.add(this.pointerGroup, { y: 0 }, this.time * 0.25, this.propsIn)
    this.tweenY.onComplete(() => this.animatePointerLeftFrom9to6())
  }

  animatePointerLeftFrom9to6() {
    this.tweenX = tweens.add(this.pointerGroup, { x: 0 }, this.time * 0.5, this.propsIn)
    this.tweenY = tweens.add(this.pointerGroup, { y: this.halfAmplitudeY }, this.time * 0.25, this.propsOut)
    this.tweenY.onComplete(() => this.animatePointerLeftFrom6to12())
  }

  animatePointerLeftFrom6to12() {
    this.tweenY = tweens.add(this.pointerGroup, { y: 0 }, this.time * 0.25, this.propsIn)
    this.tweenY.onComplete(() => this.animatePointerRightFrom9to12())
  }
}
