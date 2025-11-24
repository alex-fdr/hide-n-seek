// import threeAssets from '@components/three-assets';
import { Box3, Vector3 } from 'three';

// function repeatTexture(texture, x, y) {
//   texture.repeat.set(x, y);
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.wrapT = THREE.RepeatWrapping;
//   texture.needsUpdate = true;
//   return texture;
// }

class Utils3D {
  // constructor() {

  // }

  // getMeshFromModel(key, name) {
  //   const base = threeAssets.models[key];
  //   const model = base.scene;
  //   const mesh = name ? model.getObjectByName(name) : model;

  //   if (model.getObjectByProperty('type', 'SkinnedMesh')) {
  //     return THREE.SkeletonUtils.clone(mesh);
  //   }

  //   return mesh.clone();
  // }

  // getTexture(key, x, y = x, clone = false) {
  //   let texture = threeAssets.textures[key]
  //   texture = clone ? texture.clone() : texture

  //   if (!x) {
  //     return texture
  //   }

  //   return repeatTexture(texture, x, y, THREE.RepeatWrapping)
  // }

  getObjectSize(object) {
    const box = new Box3().setFromObject(object);
    const size = new Vector3();
    box.getSize(size);
    return size;
  }
}

export const utils3d = new Utils3D();