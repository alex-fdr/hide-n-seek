import { CylinderGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three';
import { core } from '../../core/game-core';
import { animationManager } from '../../helpers/animations';
import { materials } from '../../helpers/materials';
import { Cage } from '../cage';
import { PathFollower } from '../path-follower';

const STATES = {
    idle: 0,
    run: 1,
    defeated: 2,
    catching: 3,
};

export class Enemy {
    constructor() {
        this.parent = null;
        this.model = null;
        this.animations = {};
        this.routes = {};
        this.group = new Object3D();
        this.index = 0;

        this.status = {
            caught: false,
            firstRoute: false,
            progress: 1,
            progressDelta: -1,
            speed: 1,
        };

        this.state = STATES.idle;

        this.animationsList = [
            { key: 'character-idle', name: 'idle', loop: true, timeScale: 1 },
            { key: 'animation-dance', name: 'dance', loop: true, timeScale: 1 },
            { key: 'animation-run', name: 'run', loop: true, timeScale: 1 },
            { key: 'animation-sad', name: 'sad', loop: true, timeScale: 1 },
        ];
    }

    init(parent, data) {
        this.parent = parent;
        this.parent.add(this.group);

        this.world = core.physics.world;

        const { color, spawn, speed, route, index, size, name } = data;
        this.addModel(color, size, spawn);
        this.addPathFollower(route, speed, name);
        this.addCollider();
        this.addCage();
        this.setupModel(color, size);

        this.index = index;
        this.status.speed = speed;
    }

    activate() {
        this.state = STATES.run;
        this.animations.run.play();
    }

    deactivate() {
        this.state = STATES.defeated;
        this.animations.run.stop();
        this.animations.idle.play();
    }

    update(dt) {
        if (this.state === STATES.run) {
            this.pathFollower.update(this.group, dt);
        }
    }

    catch() {
        console.log('catch enemy');
        this.status.caught = true;
        this.state = STATES.defeated;

        this.animations.run.stop();
        this.animations.idle.play();

        this.cage.show(this.group);
        this.getSkinnedMesh().castShadow = false;
    }

    release() {
        this.status.caught = false;
        this.activate();
        this.cage.hide();
    }

    addModel(color, size = 1, props = {}) {
        const { position } = props;

        const { mesh, animationsMap } = animationManager.parse(this.animationsList);
        this.model = mesh;
        this.animations = animationsMap;

        // this.model.rotation.set(rotation.x, rotation.y, rotation.z)

        this.group.position.copy(position);

        this.group.add(this.model);
    }

    addPathFollower(route, speed, index) {
        this.pathFollower = new PathFollower();
        this.pathFollower.init(route.points, { speed, index });

        // move to the first point
        this.group.position.copy(this.pathFollower.points[0]);
    }

    addCollider() {
        const radius = 0.4;
        const height = 2;
        const geometry = new CylinderGeometry(radius, radius, height);
        const material = new MeshPhongMaterial({ color: 0xffffff });
        const collider = new Mesh(geometry, material);
        // collider.rotateX(Math.PI * 0.5);
        collider.name = 'enemy';
        collider.parentClass = this;
        collider.visible = false;
        this.collider = collider;
        this.model.add(collider);
    }

    addCage() {
        const cage = new Cage();
        cage.init();
        this.cage = cage;
    }

    setupModel(color, size) {
        this.model.scale.multiplyScalar(size);

        materials.replace(this.model, 'phong', { color, shininess: 300 }, true);
        const mesh = this.getSkinnedMesh();
        mesh.castShadow = true;
    }

    getSkinnedMesh() {
        return this.group.getObjectByProperty('type', 'SkinnedMesh');
    }
}
