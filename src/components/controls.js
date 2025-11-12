import { Vec3 } from 'cannon-es';
import { Quaternion, Vector3 } from 'three';

const PLAYER_SPEED = 3.5;

export class Controls {
    constructor({ mesh, body }) {
        this.targetMesh = mesh;
        this.targetBody = body;

        this.direction = new Vector3();
        this.destination = new Vector3();

        this.deltaPosition = new Vec3();
        this.targetPosition = new Vec3();

        this.forward = new Vec3(0, 0, 1);
        this.quaternion = new Quaternion();
        this.tempQuaternion = new Quaternion();
    }

    rotateAndMoveForward(inputData) {
        const { deltaX, deltaY } = inputData;

        this.direction.set(deltaX, 0, deltaY);
        this.direction.normalize();

        this.destination.copy(this.direction);
        this.destination.add(this.targetBody.position);

        this.moveTowardsObject(this.destination, PLAYER_SPEED);
    }

    moveTowardsObject(newPosition, speed) {
        const { x, y, z } = newPosition;
        this.targetPosition.set(x, y, z);
        this.targetPosition.vsub(this.targetBody.position, this.deltaPosition);

        this.deltaPosition.y = 0;
        this.deltaPosition.normalize();

        this.quaternion.setFromUnitVectors(this.forward, this.deltaPosition);
        this.targetMesh.quaternion.slerp(this.quaternion, 0.5);
        // this.targetMesh.quaternion.copy(this.quaternion)

        this.targetBody.velocity.x = this.deltaPosition.x * speed;
        this.targetBody.velocity.z = this.deltaPosition.z * speed;
        // this.targetBody.velocity.y -= 1
    }

    update() {
        if (this.targetMesh) {
            this.targetMesh.position.copy(this.targetBody.position);
            this.targetMesh.position.y -= 0.5;
        }
    }
}
