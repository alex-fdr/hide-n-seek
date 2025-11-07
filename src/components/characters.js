import { gameSettings } from '../models/game-settings';
import { AISeeker } from './enemy/ai-seeker';
import { EnemiesCollection } from './enemy/enemies-collection';
import { Player } from './player/player';
import config from '../assets/settings/config';

export class Characters {
    constructor({ parent }) {
        this.parent = parent;
        this.player = null;
        this.enemies = null;
        this.aiSeeker = null;

        this.status = {
            caughtEnemies: 0,
        };
    }

    init(playerData, enemiesData, aiSeekerData) {
        this.addPlayer(playerData);
        this.addEnemies(enemiesData);

        const role = config.player.role.value;

        if (role === 'seeker') {
            // do smth here
        } else if (role === 'hider') {
            this.addAISeeker(aiSeekerData);
            // make player catchable
            // add it to enemies list or smth else
        }
    }

    addPlayer(data) {
        const type = config.player.model.value;
        const size = config.player.size.value;
        const color = config.player.color.value;
        const role = config.player.role.value;
        const { position, positionHider } = data;

        this.player = new Player({
            size,
            type,
            color,
            animationsList: gameSettings.skins[type].animations,
            position: role === 'hider' ? positionHider : position,
            parent: this.parent,
        });
        this.player.init();
    }

    addEnemies(data) {
        const newEnemiesData = [];
        const enemySize = config.enemies.size.value;

        for (let i = 0; i < data.length; i++) {
            const key = `enemy${i + 1}`;
            const newColor = config[key].color.value;
            const isEnabled = config[key].enabled.value;

            if (isEnabled) {
                newEnemiesData.push({
                    ...data[i],
                    index: i,
                    color: newColor,
                    size: enemySize,
                    type: 'stickman',
                });
            }
        }

        this.enemies = new EnemiesCollection({
            parent: this.parent,
            data: newEnemiesData,
        });
    }

    addAISeeker(data) {
        const type = config.aiSeeker.model.value;
        const size = config.aiSeeker.size.value;
        const color = config.aiSeeker.color.value;
        const newData = { ...data, size, color, type };

        this.aiSeeker = new AISeeker({
            ...newData,
            animationsList: gameSettings.skins[type].animations,
            parent: this.parent,
        });
        this.aiSeeker.init();

        // this.aiSeeker.tutorialAnimation()
        // this.aiSeeker.activate()
    }

    getPlayerMeshAndBody() {
        return [this.player.group, this.player.body];
    }

    // deactivate() {

    // }

    update(walls, dt, hasPlayerInteracted) {
        if (this.player) {
            this.player.update(dt);
        }

        if (this.enemies) {
            this.enemies.update(dt);
        }

        if (this.aiSeeker) {
            this.aiSeeker.update(dt);
        }

        if (this.player && this.enemies) {
            this.player.updateSightRange(walls, this.enemies);
        }

        if (this.aiSeeker && this.player && this.enemies) {
            this.aiSeeker.updateSightRange(
                walls,
                this.enemies,
                hasPlayerInteracted ? this.player : null,
            );
            this.player.tryReleaseEnemy(this.enemies);
        }
    }
}
