import { animations } from '../../helpers/animations';
import { materials } from '../../helpers/materials';

export class StickmanSkin {
    constructor({ parent, animationsList, size, color }) {
        this.parent = parent;
        this.size = size;

        const { mesh, animationsMap } = animations.parse(animationsList);
        this.animations = animationsMap;
        this.model = mesh;
        this.model.scale.multiplyScalar(this.size);
        this.parent.add(this.model);

        this.skinnedMesh = this.model.getObjectByProperty(
            'type',
            'SkinnedMesh',
        );

        this.setupMaterials(color);
    }

    setupMaterials(color) {
        const materialProps = {
            color,
            shininess: 300,
        };
        materials.replace(this.model, 'phong', materialProps, true);
    }
}
