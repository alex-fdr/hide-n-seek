import { Enemy } from './enemy';
import { Signal } from '../../helpers/signal';
import { config } from '../../data/config';
import {
    ROLE_HIDER,
    ROLE_SEEKER,
    STATUS_PLAYER_LOSE,
    STATUS_PLAYER_WIN,
} from '../../data/game-const';
import { gameSettings } from '../../data/game-settings';

export class EnemiesCollection {
    constructor({ parent, data }) {
        this.parent = parent;
        this.enemies = this.createEnemies(data);
        this.onCatchAllEnemies = new Signal();

        this.status = {
            caughtEnemies: 0,
        };
    }

    createEnemies(enemiesData) {
        return enemiesData.map((data) => {
            return new Enemy({
                ...data,
                parent: this.parent,
                animationsList: [
                    ...gameSettings.skins[data.skinType].animations,
                ],
            });
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

        if (this.status.caughtEnemies === this.enemies.length) {
            if (config.playerRole === ROLE_SEEKER) {
                this.onCatchAllEnemies.dispatch(STATUS_PLAYER_WIN);
            } else if (config.playerRole === ROLE_HIDER) {
                this.onCatchAllEnemies.dispatch(STATUS_PLAYER_LOSE);
            }
        }
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
