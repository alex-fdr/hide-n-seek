import { CylinderGeometry, Mesh, MeshPhongMaterial, Object3D } from 'three';
import {
    ENEMY_TAG,
    ROLE_HIDER,
    ROLE_SEEKER,
    SKIN_TIGER,
} from '../../models/game-const';
import { Cage } from '../cage';
import { PathFollower } from '../path-follower';
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
        this.parent = props.parent;
        this.type = props.type;

        this.group = new Object3D();
        this.parent.add(this.group);

        this.animations = {};
        this.routes = {};
        this.index = 0;
        this.props = props;
        this.name = props.name;
        this.role = ROLE_HIDER;

        this.skin = this.createSkin(
            props.size,
            props.color,
            props.animationsList,
        );
        this.group.position.copy(props.spawn.position);

        this.status = {
            caught: false,
            firstRoute: false,
            progress: 1,
            progressDelta: -1,
            speed: 1,
        };

        this.state = STATES.idle;
    }

    init() {
        const { speed, route, index, name } = this.props;
        this.addPathFollower(route, speed, name);
        this.addCollider();
        this.addCage();

        if (this.role === ROLE_HIDER) {
            this.enableShadows();
        }

        this.index = index;
        this.status.speed = speed;
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
        collider.name = ENEMY_TAG;
        collider.parentClass = this;
        collider.visible = false;
        this.collider = collider;
        this.skin.model.add(collider);
    }

    addCage() {
        const cage = new Cage();
        cage.init();
        this.cage = cage;
    }

    enableShadows() {
        const mesh = this.getSkinnedMesh();
        mesh.castShadow = true;
    }

    getSkinnedMesh() {
        return this.skin.model.getObjectByProperty('type', 'SkinnedMesh');
    }
}
