import config from '../../assets/settings/config';
import { Enemy } from './enemy';

export class EnemiesCollection {
    constructor() {
        this.parent = null;
        this.enemies = [];

        this.status = {
            caughtEnemies: 0
        };
    }

    init(parent, enemiesData) {
        this.parent = parent;

        this.enemies = enemiesData.map((data) => {
            const enemy = new Enemy();
            enemy.init(this.parent, data);
            return enemy;
        });
    }

    update(dt) {
        if (this.enemies) {
            this.enemies.forEach((enemy) => enemy.update(dt));
        }
    }

    activate() {
        if (this.enemies) {
            this.enemies.forEach((enemy) => enemy.activate());
        }
    }

    deactivate() {
        if (this.enemies) {
            this.enemies.forEach((enemy) => enemy.deactivate());
        }
    }

    catchEnemy() {
        this.status.caughtEnemies += 1;

        const role = config.player.role.value;

        if (role === 'seeker') {
            // customEvents.foundEnemy(this.status.caughtEnemies);
        }

        if (this.status.caughtEnemies === this.enemies.length) {
            if (role === 'seeker') {
            } else if (role === 'hider') {
            }
        }
    }

    releaseEnemy() {
        this.status.caughtEnemies -= 1;
    }

    getColliders() {
        return this.enemies.map((enemy) => enemy.collider);
    }

    getAllEnemies() {
        return this.enemies;
    }

    getAllSkinnedMeshes() {
        return this.enemies.map((enemy) => enemy.getSkinnedMesh());
    }

    getEnemyByIndex(index) {
        return this.enemies.filter((en) => en.index === index)[0];
    }
}