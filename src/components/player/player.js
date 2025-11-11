import { core } from '@alexfdr/three-game-core';
import { Body, Sphere } from 'cannon-es';
import {
    CylinderGeometry,
    Mesh,
    MeshPhongMaterial,
    Object3D,
    Raycaster,
    Vector3,
} from 'three';
import { Cage } from '../cage';
import { SightRange } from '../sight-range';
import { Signal } from '../../helpers/signal';
import config from '../../assets/settings/config';
import {
    ENEMY_TAG,
    PLAYER_TAG,
    ROLE_HIDER,
    ROLE_SEEKER,
    SKIN_TIGER,
    STATUS_PLAYER_LOSE,
} from '../../data/game-const';
import { StickmanSkin } from '../skins/stickman-skin';
import { TigerSkin } from '../skins/tiger-skin';

export class Player {
    constructor({ size, type, color, animationsList, parent, position }) {
        this.parent = parent;
        this.type = type;
        this.animationsList = animationsList;
        this.role = config.player.role.value;

        this.group = this.addGroup(position);
        this.skin = this.addSkin(size, color, animationsList);
        this.skin.animations.idle.play();
        this.body = this.addPhysicalBody();

        if (this.role === ROLE_HIDER) {
            this.cage = this.addCage();
            this.collider = this.addCollider();
            this.raycaster = this.addRaycaster();
            this.enableShadows();
        } else if (this.role === ROLE_SEEKER) {
            this.sightRange = this.addSightRange();
        }

        this.onCatchBySeeker = new Signal();
        this.lookDirection = new Vector3();
        this.status = {
            moving: false,
            caught: false,
        };
    }

    addGroup(position) {
        const group = new Object3D();
        group.position.copy(position);
        this.parent.add(group);
        return group;
    }

    addSkin(size, color, animationsList) {
        const skinProps = {
            size,
            color,
            animationsList,
            parent: this.group,
        };
        return this.type === SKIN_TIGER
            ? new TigerSkin(skinProps)
            : new StickmanSkin(skinProps);
    }

    addPhysicalBody() {
        const radius = 0.5;
        const shape = new Sphere(radius);
        const body = new Body({ mass: 1 });
        body.addShape(shape);
        body.position.copy(this.group.position);
        body.fixedRotation = true;
        core.physics.world.addBody(body);
        return body;
    }

    addSightRange() {
        return new SightRange({ parent: this.group });
    }

    addCage() {
        return new Cage();
    }

    addCollider() {
        const radius = 0.5;
        const height = 2;
        const geometry = new CylinderGeometry(radius, radius, height);
        const material = new MeshPhongMaterial({ color: 0xffffff });
        const collider = new Mesh(geometry, material);
        collider.rotateX(Math.PI * 0.5);
        collider.name = PLAYER_TAG;
        collider.parentClass = this;
        collider.visible = false;
        this.skin.model.add(collider);
        return collider;
    }

    addRaycaster() {
        const raycaster = new Raycaster();
        raycaster.near = 0;
        raycaster.far = 1;
        return raycaster;
    }

    enableShadows() {
        this.skin.skinnedMesh.castShadow = true;
    }

    getModel() {
        return this.group;
    }

    getSkinnedMesh() {
        return this.skin.skinnedMesh;
    }

    getCollider() {
        return this.collider;
    }

    startMoving() {
        this.status.moving = true;

        this.skin.animations.idle.crossFadeTo(this.skin.animations.run, 0.2);
        this.skin.animations.run.reset();
        this.skin.animations.run.play();
    }

    stopMoving() {
        this.status.moving = false;

        this.skin.animations.run.crossFadeTo(this.skin.animations.idle, 0.2);
        this.skin.animations.idle.reset();
        this.skin.animations.idle.play();
    }

    catch() {
        console.log('catch player');

        this.stopMoving();

        this.status.caught = true;

        this.cage.show(this.group);
        this.onCatchBySeeker.dispatch(STATUS_PLAYER_LOSE);
        // sqHelper.levelLose();
    }

    finalDance() {
        this.skin.animations.idle.stop();
        this.skin.animations.run.stop();
        this.skin.animations.dance.play();

        // reset rotation
        this.group.quaternion.set(0, 0, 0, 1);

        if (this.sightRange) {
            this.sightRange.hide();
        }
    }

    finalLose() {
        this.skin.animations.idle.stop();
        this.skin.animations.run.stop();
        this.skin.animations.sad.play();

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
        this.sightRange?.update(walls, enemies);
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

                if (name === ENEMY_TAG && parentClass.status.caught) {
                    parentClass.release();
                    enemies.releaseEnemy();
                }
            });
        }
    }
}
