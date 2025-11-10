import {
    BackSide,
    LinearFilter,
    Mesh,
    MeshBasicMaterial,
    Object3D,
    PlaneGeometry,
    Raycaster,
    Texture,
    Vector3,
} from 'three';
import { ENEMY_TAG, PLAYER_TAG } from '../data/game-const';

const LINE_AMOUNT = 120;
const LINE_LENGTH = 3;
const ANGLE_STEP = 0.01;
const LINE_STEP = 2;
const HALF_PI = Math.PI * 0.5;
const TWO_PI = Math.PI * 2;
const CIRCLE_RADIUS = 40;
const TEXTURE_SIZE = 512;
const SEGMENT_LENGTH = TEXTURE_SIZE / LINE_LENGTH / 2;
const HALF_VIEW_ANGLE = LINE_AMOUNT * ANGLE_STEP * 0.5;

export class SightRange {
    constructor() {
        this.plane = null;
        this.texture = null;
        this.ctx = null;
        this.parent = null;
        this.group = new Object3D();

        this.X_AXIS = new Vector3(1, 0, 0);
        this.Y_AXIS = new Vector3(0, 1, 0);
        this.Z_AXIS = new Vector3(0, 0, 1);
        this.direction = new Vector3();
        this.lookDirection = new Vector3();

        this.raycaster = new Raycaster();
        this.raycaster.near = 0;
        this.raycaster.far = LINE_LENGTH;

        this.enemyRaycaster = new Raycaster();
        this.enemyRaycaster.near = 0;
    }

    init(parent) {
        this.parent = parent;
        this.parent.add(this.group);

        this.createCanvas();
        this.createGradients();

        // this.drawRange()
        // this.drawCircle()
    }

    hide() {
        this.group.visible = false;
    }

    update(walls, enemies, player) {
        this.updateRange(walls, enemies, player);
    }

    createCanvas() {
        const canvas = document.createElement('canvas');
        canvas.setAttribute('width', TEXTURE_SIZE);
        canvas.setAttribute('height', TEXTURE_SIZE);

        this.ctx = canvas.getContext('2d');
        this.ctx.imageSmoothingEnabled = true;
        this.ctx.imageSmoothingQuality = 'medium';

        const geometry = new PlaneGeometry(1, 1);
        const material = new MeshBasicMaterial({
            transparent: true,
            opacity: 1,
            side: BackSide,
            map: new Texture(canvas),
        });
        material.map.minFilter = LinearFilter;
        material.map.magFilter = LinearFilter;

        this.plane = new Mesh(geometry, material);
        this.plane.rotateX(HALF_PI);
        this.plane.position.y = 0.01;
        this.plane.scale.multiplyScalar(LINE_LENGTH * 2);
        this.group.add(this.plane);

        this.texture = material.map;
    }

    createGradients() {
        const w = -TEXTURE_SIZE / 2;
        this.linearGradient = this.ctx.createLinearGradient(0, 0, 0, w);
        this.linearGradient.addColorStop(0.0, 'rgba(180, 15, 15, 1)');
        this.linearGradient.addColorStop(0.5, 'rgba(180, 15, 15, 1)');
        this.linearGradient.addColorStop(1.0, 'rgba(240, 40, 15, 1)');

        const x = TEXTURE_SIZE / 2;
        const y = TEXTURE_SIZE / 2;
        const r0 = CIRCLE_RADIUS * 0.9;
        const r1 = CIRCLE_RADIUS;
        this.radialGradient = this.ctx.createRadialGradient(x, y, r0, x, y, r1);
        this.radialGradient.addColorStop(0.0, 'rgba(180, 15, 15, 1)');
        this.radialGradient.addColorStop(1.0, 'rgba(180, 15, 15, 0)');
    }

    // drawRange() {
    //     this.prepareDrawing();

    //     for (let i = 0; i < LINE_AMOUNT; i += LINE_STEP) {
    //         const currentAngle = this.halfAngle - ANGLE_STEP * i - HALF_PI;
    //         this.drawSegment(currentAngle, LINE_LENGTH);
    //     }

    //     this.completeDrawing();
    // }

    drawSegment(angle, distance) {
        const x = Math.cos(angle) * distance * SEGMENT_LENGTH;
        const y = Math.sin(angle) * distance * SEGMENT_LENGTH;

        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(x, y);
        this.ctx.lineTo(0, 0);
    }

    drawCircle() {
        const cx = TEXTURE_SIZE * 0.5;
        const cy = TEXTURE_SIZE * 0.5;
        this.ctx.beginPath();
        this.ctx.arc(cx, cy, CIRCLE_RADIUS, 0, TWO_PI);
        this.ctx.closePath();
        this.ctx.fillStyle = this.radialGradient;
        this.ctx.fill();
    }

    prepareDrawing() {
        this.ctx.clearRect(0, 0, TEXTURE_SIZE, TEXTURE_SIZE);

        // move drawing center to the canvas center
        this.ctx.translate(TEXTURE_SIZE * 0.5, TEXTURE_SIZE * 0.5);

        // line style
        this.ctx.lineWidth = 10;
        this.ctx.lineCap = 'round';

        this.ctx.beginPath();
    }

    completeDrawing() {
        this.ctx.closePath();

        // visualize shape
        this.ctx.strokeStyle = this.linearGradient;
        this.ctx.stroke();

        // reset transform
        this.ctx.translate(-TEXTURE_SIZE * 0.5, -TEXTURE_SIZE * 0.5);

        // update texture to see changes
        this.texture.needsUpdate = true;
    }

    updateRange(walls, enemies, player) {
        const { x, y, z } = this.group.position;
        const { position } = this.parent;
        const origin = new Vector3(
            position.x + x,
            position.y + y,
            position.z + z,
        );
        this.parent.getWorldDirection(this.lookDirection);

        this.prepareDrawing();

        for (let i = 0; i < LINE_AMOUNT; i += LINE_STEP) {
            const currentAngle = HALF_VIEW_ANGLE - ANGLE_STEP * i - HALF_PI;

            this.direction.copy(this.lookDirection);
            this.direction.applyAxisAngle(this.Y_AXIS, currentAngle + HALF_PI);
            this.raycaster.set(origin, this.direction);

            const intersections = this.raycaster.intersectObjects(
                walls.children,
                true,
            );

            let drawn = false;
            let currentLength = LINE_LENGTH;

            if (intersections.length > 0) {
                const distanceShortest = intersections[0].distance;

                if (distanceShortest <= LINE_LENGTH) {
                    this.drawSegment(currentAngle, distanceShortest);
                    drawn = true;
                    currentLength = distanceShortest;
                }
            }

            if (!drawn) {
                this.drawSegment(currentAngle, LINE_LENGTH);
            }

            this.detectEnemies(
                enemies,
                player,
                origin,
                this.direction,
                Math.min(currentLength, LINE_LENGTH),
            );
        }

        this.completeDrawing();
        this.drawCircle();
    }

    detectEnemies(enemies, player, origin, direction, currentLength) {
        this.enemyRaycaster.far = currentLength;
        this.enemyRaycaster.set(origin, direction);

        const targets = enemies.getColliders();

        if (player) {
            targets.push(player.getCollider());
        }

        const intersections = this.enemyRaycaster.intersectObjects(
            targets,
            false,
        );

        if (intersections.length === 0) {
            return;
        }

        for (const intersection of intersections) {
            const { object } = intersection;
            const { name, parentClass } = object;

            if (name === ENEMY_TAG && !parentClass.status.caught) {
                parentClass.catch();
                enemies.catchEnemy();
            }

            if (name === PLAYER_TAG && !parentClass.status.caught) {
                parentClass.catch();
            }
        }
    }
}
