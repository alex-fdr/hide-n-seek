import { factory } from '../pixi/pixi-factory'
import { TextCounter } from './text-counter'

export class Timer {
  constructor(value = 10) {
    this.text = new TextCounter({
      value: value,
      changeTime: value * 1000,
      fontSize: 60,
      color: '#fff',
      changeAnimation: true,
      digitsAfterPoint: 0,
    })

    this.group = this.text.group
    this.onComplete = this.text.onComplete
    this.initialValue = this.text.value

    this.bg = factory.sprite('timer-bg')
    this.group.addChildAt(this.bg, 0)
    
  }

  start() {
    this.text.updateValue(-this.text.value)

    this.text.onComplete.addOnce(() => {
      console.log('timer compete');
    })
  }
  
  stop() {
    this.text.stop()
  }

  setPosition(x, y) {
    this.text.group.position.set(x, y)
  }

  getElapsedTime() {
    return this.initialValue - Math.floor(this.text.value)
  }
}