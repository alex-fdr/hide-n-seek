import { assets, core } from '@alexfdr/three-game-core';
import { getObjectSize } from '@alexfdr/three-game-utils';
import { Body, Box, Vec3 } from 'cannon-es';
import { Quaternion, Vector3 } from 'three';
import { config } from '../data/config';
import { materials } from '../systems/materials';

function makeCannonBox(mesh) {
    const { x, y, z } = getObjectSize(mesh).multiplyScalar(0.5);
    return new Box(new Vec3(x, y, z));
}

export class LevelLayout {
    constructor({ parent }) {
        this.parent = parent;

        this.addModel();
        this.initGround();
        this.initWalls();
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
        core.physics.world.addBody(body);

        materials.replace(this.ground, 'phong', {
            color: config.groundColor,
        });
    }

    initWalls() {
        this.walls = this.model.getObjectByName('Walls');

        const worldPosition = new Vector3();
        const worldQuaternion = new Quaternion();

        for (const wall of this.walls.children) {
            wall.updateMatrixWorld(true);
            wall.getWorldPosition(worldPosition);
            wall.getWorldQuaternion(worldQuaternion);

            // reset rotation to calculate correct object size
            const rotationY = wall.rotation.y;
            wall.rotation.y = 0;

            const body = new Body({ mass: 0 });
            const shape = makeCannonBox(wall);

            // restore rotation
            wall.rotation.y = rotationY;

            // note:
            // to make a body position the same as the mesh position without any offset
            // in Blender apply "Origin to Center of Mass (Surface)" to the mesh

            body.addShape(shape);
            body.position.copy(worldPosition);
            body.quaternion.copy(worldQuaternion);

            core.physics.world.addBody(body);
        }

        materials.replace(this.walls, 'lambert', {
            color: config.wallsColor,
        });
    }

    enableShadows() {
        this.ground.receiveShadow = true;

        this.walls.traverse((child) => {
            if (child.isMesh) {
                child.castShadow = true;
            }
        });
    }
}
