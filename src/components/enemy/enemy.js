import { CylinderGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three';
import { Cage } from '../cage';
import { PathFollower } from '../path-follower';
import { ENEMY_TAG, ROLE_HIDER, SKIN_TIGER } from '../../data/game-const';
import { StickmanSkin } from '../skins/stickman-skin';
import { TigerSkin } from '../skins/tiger-skin';

const STATES = {
    idle: 0,
    run: 1,
    defeated: 2,
    catching: 3,
};

export class Enemy {
    constructor(props) {
        // biome-ignore format: keep it in one line
        const { parent, skinType, index, name, route, speed, spawn, size, color, animationsList } = props;

        this.parent = parent;
        this.skinType = skinType;
        this.index = index;

        this.animations = {};
        this.routes = {};
        this.name = name;
        this.role = ROLE_HIDER;
        this.state = STATES.idle;

        this.group = this.addGroup(spawn.position);
        this.skin = this.addSkin(size, color, animationsList);
        this.pathFollower = this.addPathFollower(route, speed, name);
        this.collider = this.addCollider();
        this.cage = this.addCage();

        this.status = {
            speed,
            caught: false,
            firstRoute: false,
            progress: 1,
            progressDelta: -1,
        };

        if (this.role === ROLE_HIDER) {
            this.enableShadows();
        }
    }

    addGroup(position) {
        const group = new Object3D();
        this.parent.add(group);
        group.name = `enemy-${this.name}`;
        group.position.copy(position);
        return group;
    }

    addSkin(size, color, animationsList) {
        const skinProps = {
            size,
            color,
            animationsList,
            parent: this.group,
        };
        return this.skinType === SKIN_TIGER
            ? new TigerSkin(skinProps)
            : new StickmanSkin(skinProps);
    }

    activate() {
        this.state = STATES.run;
        this.skin.animations.run.play();
    }

    deactivate() {
        this.state = STATES.defeated;
        this.skin.animations.run.stop();
        this.skin.animations.idle.play();
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

        this.skin.animations.run.stop();
        this.skin.animations.idle.play();

        this.cage.show(this.group);
        this.getSkinnedMesh().castShadow = false;
    }

    release() {
        this.status.caught = false;
        this.activate();
        this.cage.hide();
    }

    addPathFollower(route, speed, index) {
        const pathFollower = new PathFollower({
            index,
            speed,
            points: route.points,
        });
        this.group.position.copy(pathFollower.points[0]);
        return pathFollower;
    }

    addCollider() {
        const radius = 0.25;
        const height = 3;
        const geometry = new CylinderGeometry(radius, radius, height);
        const material = new MeshPhongMaterial({ color: 0xffffff });
        const collider = new Mesh(geometry, material);
        collider.name = ENEMY_TAG;
        collider.parentClass = this;
        collider.visible = false;
        this.skin.model.add(collider);
        return collider;
    }

    addCage() {
        return new Cage();
    }

    enableShadows() {
        const mesh = this.getSkinnedMesh();
        mesh.castShadow = true;
    }

    getSkinnedMesh() {
        return this.skin.model.getObjectByProperty('type', 'SkinnedMesh');
    }
}
