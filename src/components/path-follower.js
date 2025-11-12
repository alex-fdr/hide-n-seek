import { core } from '@alexfdr/three-game-core';
import {
    CatmullRomCurve3,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    SphereGeometry,
    TubeGeometry,
    Vector3,
} from 'three';

export class PathFollower {
    constructor({ points = [], speed = 1 }) {
        this.progress = 0;
        this.speed = 1.8 * speed;
        this.direction = 1;

        this.points = points.map(([x, y, z]) => new Vector3(x, y, z));
        this.pathCurve = new CatmullRomCurve3(this.points);
        this.k = 1 / this.pathCurve.getLength();

        this.pathPoints = null;
        this.pathMesh = null;
    }

    renderPoints() {
        const geometry = new SphereGeometry(0.15);
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new Mesh(geometry, material);

        this.pathPoints = new Object3D();
        this.pathPoints.name = 'path-points';
        core.scene.add(this.pathPoints);

        for (const p of this.points) {
            const sphere = mesh.clone();
            sphere.position.copy(p);
            this.pathPoints.add(sphere);
        }
    }

    renderPath() {
        const geometry = new TubeGeometry(this.pathCurve, 100, 0.05, 8, false);
        const material = new MeshBasicMaterial({ color: 0xece5d3 });
        this.pathMesh = new Mesh(geometry, material);
        core.scene.add(this.pathMesh);
    }

    renderLookAtPoint(position) {
        if (!this.lookAtMesh) {
            const geometry = new SphereGeometry(0.15);
            const material = new MeshBasicMaterial({ color: 0xff0000 });
            const mesh = new Mesh(geometry, material);
            threeScene.scene.add(mesh);
            this.lookAtMesh = mesh;
        }

        this.lookAtMesh.position.copy(position);
    }

    update(target, dt) {
        if (this.progress > 1) {
            this.progress = 0;
            this.direction *= -1;
            this.reversePath();
            return;
        }

        this.updatePosition(target);
        this.updateRotation(target);
        this.updateProgress(dt);
    }

    updateProgress(dt) {
        const mult = 1 / this.pathCurve.getLength();
        this.progress += mult * this.speed * dt;
    }

    updatePosition(target) {
        const currentPosition = this.pathCurve.getPointAt(this.progress);
        target.position.copy(currentPosition);
    }

    updateRotation(target) {
        const tangent = this.pathCurve.getTangentAt(this.progress);
        const point = tangent.add(target.position);
        target.lookAt(point);
    }

    reversePath() {
        this.pathCurve.points.reverse();
        this.pathCurve.updateArcLengths();
    }
}
