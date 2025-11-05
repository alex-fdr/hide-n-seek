import { materials } from '../../helpers/materials';
import { Player } from '../player/player';

export class TigerPlayer extends Player {
  constructor(size = 1) {
    super()

    this.type = 'tiger'
    this.size = size

    this.animationsList = [
      { key: 'tiger-idle', name: 'idle', loop: true, timeScale: 1 },
      { key: 'animation-dance', name: 'dance', loop: true, timeScale: 0.9 },
      { key: 'animation-run', name: 'run', loop: true, timeScale: 1 },
      { key: 'animation-sad', name: 'sad', loop: true, timeScale: 1 },
    ]
  }

  setupModel() {
    this.model.scale.multiplyScalar(this.size)
    materials.replace(this.model, 'lambert', { emissive: 0x222222 }, true)
    // const m = this.model.getObjectByProperty('type', 'SkinnedMesh')
  }
}