import threeScene from '@components/three-scene'

export class RaycasterHelper {
  constructor() {
    this.camera = threeScene.camera
    this.domElement = threeScene.renderer.domElement
    this.interactiveObjects = []

    this.raycaster = new THREE.Raycaster()
    this.pointer = new THREE.Vector2()
    this.selectedObject = null
    this.selectedPoint = new THREE.Vector3()
    this.intersections = []
  }

  setInteractiveObjects(objects) {
    this.interactiveObjects = objects
  }

  process(data) {
    this.updatePointer(data.clientX, data.clientY)

    this.intersections.length = 0

    this.raycaster.setFromCamera(this.pointer, this.camera)
    this.raycaster.intersectObjects(this.interactiveObjects, true, this.intersections)

    if (this.intersections.length > 0) {
      this.selectedObject = this.intersections[0].object
      this.selectedPoint.copy(this.intersections[0].point)
    }
  }

  updatePointer(x, y) {
    const rect = this.domElement.getBoundingClientRect()

    this.pointer.x = ((x - rect.left) / rect.width) * 2 - 1;
    this.pointer.y = -((y - rect.top) / rect.height) * 2 + 1;
  }
}