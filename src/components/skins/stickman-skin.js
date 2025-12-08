import { MeshPhongMaterial } from 'three';
import { animations } from '../../systems/animations';

export class StickmanSkin {
    constructor({ parent, animationsList, size, color }) {
        this.parent = parent;
        this.size = size;

        const { mesh, animationsMap } = animations.parse(animationsList);
        this.animations = animationsMap;
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
