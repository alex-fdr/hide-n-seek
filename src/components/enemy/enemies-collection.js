import { Enemy } from './enemy';
import config from '../../assets/settings/config';
import { gameSettings } from '../../data/game-settings';

export class EnemiesCollection {
    constructor({ parent, data }) {
        this.parent = parent;
        this.enemies = this.createEnemies(data);

        this.status = {
            caughtEnemies: 0,
        };
    }

    createEnemies(enemiesData) {
        return enemiesData.map((data) => {
            const enemy = new Enemy({
                ...data,
                parent: this.parent,
                animationsList: [...gameSettings.skins[data.type].animations],
            });
            enemy.init();
            return enemy;
        });
    }

    update(dt) {
        for (const enemy of this.enemies) {
            enemy.update(dt);
        }
    }

    activate() {
        for (const enemy of this.enemies) {
            enemy.activate();
        }
    }

    deactivate() {
        for (const enemy of this.enemies) {
            enemy.deactivate();
        }
    }

    catchEnemy() {
        this.status.caughtEnemies += 1;

        // const role = config.player.role.value;

        // if (this.status.caughtEnemies === this.enemies.length) {
        //     if (role === 'seeker') {
        //     } else if (role === 'hider') {
        //     }
        // }
    }

    releaseEnemy() {
        this.status.caughtEnemies -= 1;
    }

    getColliders() {
        return this.enemies.map((enemy) => enemy.collider);
    }

    getAll() {
        return this.enemies;
    }

    getAllSkinnedMeshes() {
        return this.enemies.map((enemy) => enemy.getSkinnedMesh());
    }

    getEnemyByIndex(index) {
        return this.enemies.filter((en) => en.index === index)[0];
    }
}
