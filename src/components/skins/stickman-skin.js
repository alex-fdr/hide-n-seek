import { animations } from '@alexfdr/three-game-components';
import { MeshPhongMaterial } from 'three';

export class StickmanSkin {
    constructor({ parent, animationsList, size, color }) {
        this.parent = parent;
        this.size = size;

        const { mesh, anims } = animations.parse(animationsList);
        this.animations = anims;
        this.model = mesh;
        this.model.scale.multiplyScalar(this.size);
        this.parent.add(this.model);

        this.skinnedMesh = this.model.getObjectByProperty('type', 'SkinnedMesh');

        this.setupMaterials(color);
    }

    setupMaterials(color) {
        this.skinnedMesh.material = new MeshPhongMaterial({
            color,
            shininess: 300,
        });
    }
}
