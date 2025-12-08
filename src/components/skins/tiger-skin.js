import { MeshLambertMaterial } from 'three';
import { StickmanSkin } from './stickman-skin';

export class TigerSkin extends StickmanSkin {
    setupMaterials() {
        const { map } = this.skinnedMesh.material;
        this.skinnedMesh.material = new MeshLambertMaterial({ map });
    }
}
