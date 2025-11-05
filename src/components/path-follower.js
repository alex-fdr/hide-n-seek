import { CatmullRomCurve3, Mesh, MeshBasicMaterial, Object3D, SphereGeometry, TubeGeometry, Vector3 } from 'three';
// import { debug } from '../core/debug/debug';
import { core } from '../core/game-core';

export class PathFollower {
    constructor() {
        this.points = [];
        this.pointsGroup = null;
        this.pathCurve = null;
        this.pathMesh = null;
        this.progress = 0;
        this.speed = 1.8;
        this.k = 0;
        this.direction = 1;
    }

    init(points = [], { speed /* , index  */ }) {
        this.points = points.map(([x, y, z]) => new Vector3(x, y, z));
        this.pathCurve = new CatmullRomCurve3(this.points);

        this.k = 1 / this.pathCurve.getLength();

        if (speed) {
            this.speed *= speed;
        }

        /*         debug.gui.addCustomControl(`path-${index}`, (status) => {
                    if (this.pathMesh) {
                        this.pathMesh.visible = status;
                    } else {
                        this.renderPath();
                    }
        
                    if (this.pointsGroup) {
                        this.pointsGroup.visible = status;
                    } else {
                        this.renderPoints();
                    }
                }, false); */

        // this.renderPath();
        // this.renderPoints();

        // this.flag = false
    }

    renderPoints() {
        const geometry = new SphereGeometry(0.15);
        const material = new MeshBasicMaterial({ color: 0xff0000 });
        const mesh = new Mesh(geometry, material);
        this.pointsGroup = new Object3D();
        this.pointsGroup.name = 'path-points';
        core.scene.add(this.pointsGroup);

        this.points.forEach((pos) => {
            const point = mesh.clone();
            point.position.copy(pos);
            this.pointsGroup.add(point);
        });
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
        // const d = this.direction > 0 ? this.progress : 1 - this.progress;
        const currentPosition = this.pathCurve.getPointAt(this.progress);
        target.position.copy(currentPosition);
    }

    updateRotation(target) {
        // const d = this.direction > 0 ? this.progress : 1 - this.progress;
        const tangent = this.pathCurve.getTangentAt(this.progress);
        const point = tangent.add(target.position);
        target.lookAt(point);

        // this.renderLookAtPoint(point)
    }

    reversePath() {
        this.pathCurve.points.reverse();
        this.pathCurve.updateArcLengths();
        // this.pathCurve.points.reverse()
    }
}
