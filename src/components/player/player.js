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
import {
    ENEMY_TAG,
    PLAYER_TAG,
    ROLE_HIDER,
    ROLE_SEEKER,
    SKIN_TIGER,
} from '../../models/game-const';
import { Cage } from '../cage';
import { SightRange } from '../sight-range';
import { StickmanSkin } from '../skins/stickman-skin';
import { TigerSkin } from '../skins/tiger-skin';
import config from '../../assets/settings/config';

export class Player {
    constructor({ size, type, color, animationsList, parent, position }) {
        this.parent = parent;
        this.type = type;
        this.animationsList = animationsList;
        this.role = config.player.role.value;

        this.group = new Object3D();
        this.group.position.copy(position);
        this.parent.add(this.group);

        this.skin = this.createSkin(size, color, animationsList);
        this.skin.animations.idle.play();

        this.status = {
            moving: false,
            caught: false,
        };
    }

    createSkin(size, color, animationsList) {
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

    init() {
        this.addPhysicalBody();

        if (this.role === ROLE_SEEKER) {
            this.addSightRange();
        } else if (this.role === ROLE_HIDER) {
            this.addCage();
            this.addCollider();
            this.addRaycaster();
            this.enableShadows();
        }
    }

    addPhysicalBody() {
        const radius = 0.5;
        const shape = new Sphere(radius);
        this.body = new Body({ mass: 1 });
        this.body.addShape(shape);
        this.body.position.copy(this.group.position);
        this.body.fixedRotation = true;
        core.physics.world.addBody(this.body);
    }

    addSightRange() {
        this.sightRange = new SightRange();
        this.sightRange.init(this.group);
    }

    addCage() {
        this.cage = new Cage();
        this.cage.init();
    }

    addCollider() {
        const radius = 0.5;
        const height = 2;
        const geometry = new CylinderGeometry(radius, radius, height);
        const material = new MeshPhongMaterial({ color: 0xffffff });
        this.collider = new Mesh(geometry, material);
        this.collider.rotateX(Math.PI * 0.5);
        this.collider.name = PLAYER_TAG;
        this.collider.parentClass = this;
        this.collider.visible = false;
        this.skin.model.add(this.collider);
    }

    addRaycaster() {
        this.raycaster = new Raycaster();
        this.raycaster.near = 0;
        this.raycaster.far = 1;
        this.lookDirection = new Vector3();
    }

    enableShadows() {
        this.getSkinnedMesh().castShadow = true;
    }

    getModel() {
        return this.group;
    }

    getSkinnedMesh() {
        return this.skin.skinnedMesh;
        //     return this.skin.model.getObjectByProperty('type', 'SkinnedMesh');
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

        // customEvents.userFailedTimer(screens.ui.timer.getElapsedTime());
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
