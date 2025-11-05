// import threeScene from '@components/three-scene';
import { Body, Box, Vec3 } from 'cannon-es';
import { Quaternion, Vector3 } from 'three';
import config from '../assets/settings/config';
import { assets } from '../core/assets';
import { core } from '../core/game-core';
import { materials } from '../helpers/materials';
import { utils3d } from '../helpers/utils3d';

function makeCannonBox(mesh) {
    const size = utils3d.getObjectSize(mesh).multiplyScalar(0.5);
    return new Box(new Vec3(size.x, size.y, size.z));
}

export class LevelLayout {
    constructor() {
        this.parent = null;
        this.model = null;
        this.world = null;
    }

    init(parent) {
        this.parent = parent;
        this.world = core.physics.world;

        this.addModel();
        this.initGround();
        this.initWalls();
        this.setupMaterials();
        this.enableShadows();
    }

    addModel() {
        this.model = assets.models.get('level');
        this.parent.add(this.model);
    }

    initGround() {
        this.ground = this.model.getObjectByName('Ground');

        const body = new Body({ mass: 0 });
        const shape = makeCannonBox(this.ground);

        body.addShape(shape);
        body.position.copy(this.ground.position);

        this.world.addBody(body);
    }

    initWalls() {
        this.walls = this.model.getObjectByName('Walls');

        this.walls.children.forEach((wall) => {
            wall.updateMatrixWorld(true);

            const worldPosition = new Vector3();
            wall.getWorldPosition(worldPosition);

            const worldQuaternion = new Quaternion();
            wall.getWorldQuaternion(worldQuaternion);

            // reset rotation to calculate correct object size
            const rotationY = wall.rotation.y;
            wall.rotation.y = 0;

            const body = new Body({ mass: 0 });
            const shape = makeCannonBox(wall);

            // restore rotation
            wall.rotation.y = rotationY;

            // note:
            // to make the body position the same as the mesh position without any offset
            // in blender apply "Origin to Center of Mass (Surface)" to the mesh

            body.addShape(shape);
            body.position.copy(worldPosition);
            body.quaternion.copy(worldQuaternion);

            this.world.addBody(body);
        });
    }

    enableShadows() {
        this.walls.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });

        this.ground.receiveShadow = true;
    }

    setupMaterials() {
        // this.walls.children[0].material.color.setHex(0xacacac)
        // this.ground.material.color.setHex(0x9c9c9c)
        // materials.replace(this.walls, 'lambert', { color: 0xaaaaaa })

        const wallsColor = config.game.wallsColor.value;
        const groundColor = config.game.groundColor.value;

        materials.replace(this.walls, 'lambert', { color: wallsColor });
        materials.replace(this.ground, 'lambert', { color: groundColor });

        // this.walls.children[0].material.color.convertSRGBToLinear()
        // this.ground.material.color.convertSRGBToLinear()
    }
}

// export const levelLayout = new LevelLayout()
