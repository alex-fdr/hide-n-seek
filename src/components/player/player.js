import { Body, Sphere } from 'cannon-es';
import {
    CylinderGeometry,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    Raycaster,
    Vector3,
} from 'three';
import { core } from '../../core/game-core';
import { animationManager } from '../../helpers/animations';
import { materials } from '../../helpers/materials';
import config from '../../assets/settings/config';
import { Cage } from '../cage';
import { SightRange } from '../sight-range';

export class Player {
    constructor(size = 1) {
        this.parent = null;
        this.model = null;
        this.skinnedMesh = null;

        this.animations = {};
        this.group = new Object3D();

        this.size = size;
        this.type = 'character';
        this.role = '';

        this.status = {
            moving: false,
            caught: false,
        };

        this.animationsList = [
            { key: 'character-idle', name: 'idle', loop: true, timeScale: 1 },
            { key: 'animation-dance', name: 'dance', loop: true, timeScale: 1 },
            { key: 'animation-run', name: 'run', loop: true, timeScale: 1 },
            { key: 'animation-sad', name: 'sad', loop: true, timeScale: 1 },
        ];
    }

    init(parent, data = {}) {
        this.parent = parent;
        this.parent.add(this.group);

        this.role = config.player.role.value;

        const { color, position } = data;

        this.addModel(position);
        this.addPhysicalBody();

        if (this.role === 'seeker') {
            this.addSightRange();
        } else if (this.role === 'hider') {
            this.addCage();
            this.addCollider();
            this.addRaycaster();
        }

        this.setupModel(color);
    }

    addModel(position) {
        const { mesh, animationsMap } = animationManager.parse(
            this.animationsList,
        );

        this.model = mesh;
        this.animations = animationsMap;

        this.animations.idle.play();

        this.group.position.copy(position);

        this.group.add(this.model);
    }

    addPhysicalBody() {
        const radius = 0.5;
        const body = new Body({ mass: 1 });
        const shape = new Sphere(radius);

        body.addShape(shape);
        body.position.copy(this.group.position);
        body.fixedRotation = true;

        core.physics.world.addBody(body);

        this.body = body;
    }

    addSightRange() {
        const range = new SightRange();
        range.init(this.group);
        this.sightRange = range;
    }

    addCage() {
        const cage = new Cage();
        cage.init();
        this.cage = cage;
    }

    addCollider() {
        const radius = 0.5;
        const height = 2;
        const geometry = new CylinderGeometry(radius, radius, height);
        const material = new MeshPhongMaterial({ color: 0xffffff });
        const collider = new Mesh(geometry, material);
        collider.rotateX(Math.PI * 0.5);
        collider.name = 'player';
        collider.parentClass = this;
        collider.visible = false;
        this.collider = collider;
        this.model.add(collider);
    }

    addRaycaster() {
        const raycaster = new Raycaster();
        raycaster.near = 0;
        raycaster.far = 1;
        this.raycaster = raycaster;
        this.lookDirection = new Vector3();
    }

    setupModel(color) {
        this.model.scale.multiplyScalar(this.size);

        if (color) {
            materials.replace(
                this.model,
                'phong',
                {
                    color,
                    shininess: 300,
                },
                true,
            );
        }
    }

    setupMaterials() {}

    getModel() {
        return this.group;
    }

    getSkinnedMesh() {
        return this.group.getObjectByProperty('type', 'SkinnedMesh');
    }

    getCollider() {
        return this.collider;
    }

    startMoving() {
        this.status.moving = true;

        this.animations.idle.crossFadeTo(this.animations.run, 0.2);
        this.animations.run.reset();
        this.animations.run.play();
    }

    stopMoving() {
        this.status.moving = false;

        this.animations.run.crossFadeTo(this.animations.idle, 0.2);
        this.animations.idle.reset();
        this.animations.idle.play();
    }

    catch() {
        console.log('catch player');

        this.stopMoving();

        this.status.caught = true;

        this.cage.show(this.group);

        // customEvents.userFailedTimer(screens.ui.timer.getElapsedTime());
        // sqHelper.levelLose();
    }

    finalDance() {
        this.animations.idle.stop();
        this.animations.run.stop();
        this.animations.dance.play();

        // reset rotation
        this.group.quaternion.set(0, 0, 0, 1);

        if (this.sightRange) {
            this.sightRange.hide();
        }
    }

    finalLose() {
        this.animations.idle.stop();
        this.animations.run.stop();
        this.animations.sad.play();

        if (this.sightRange) {
            this.sightRange.hide();
        }
    }

    update(dt) {
        if (!this.status.moving && this.body) {
            this.body.velocity.x *= 0.1;
            this.body.velocity.y *= 0.1;
            this.body.velocity.z *= 0.1;
        }
    }

    updateSightRange(walls, enemies) {
        if (this.sightRange) {
            this.sightRange.update(walls, enemies);
        }
    }

    tryReleaseEnemy(enemies) {
        this.group.getWorldDirection(this.lookDirection);

        this.raycaster.set(this.group.position, this.lookDirection);

        const intersections = this.raycaster.intersectObjects(
            enemies.getColliders(),
        );

        if (intersections.length > 0) {
            intersections.forEach((data) => {
                const {
                    object: { name, parentClass },
                } = data;

                if (name === 'enemy' && parentClass.status.caught) {
                    parentClass.release();
                    enemies.releaseEnemy();
                }
            });
        }
    }
}
