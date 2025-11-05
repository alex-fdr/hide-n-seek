import config from '../assets/settings/config';
import { AISeeker } from './enemy/ai-seeker';
import { EnemiesCollection } from './enemy/enemies-collection';
import { Player } from './player/player';
import { TigerAI } from './tiger/tiger-ai';
import { TigerPlayer } from './tiger/tiger-player';

export class Characters {
    constructor() {
        this.parent = null;
        this.player = null;

        this.status = {
            caughtEnemies: 0,
        };
    }

    init(parent, playerData, enemiesData, aiSeekerData) {
        this.parent = parent;

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

        this.player =
            type === 'tiger' ? new TigerPlayer(size) : new Player(size);
        this.player.init(this.parent, {
            color,
            position: role === 'hider' ? positionHider : position,
        });
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
                });
            }
        }

        this.enemies = new EnemiesCollection();
        this.enemies.init(this.parent, newEnemiesData);
        // this.enemies.getAllSkinnedMeshes().forEach((el) => {el.castShadow = true);
    }

    addAISeeker(data) {
        const type = config.aiSeeker.model.value;
        const size = config.aiSeeker.size.value;
        const color = config.aiSeeker.color.value;
        const newData = { ...data, size, color };

        this.aiSeeker = type === 'tiger' ? new TigerAI(size) : new AISeeker();
        this.aiSeeker.init(this.parent, newData);

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
            const player = hasPlayerInteracted ? this.player : null;
            this.aiSeeker.updateSightRange(walls, this.enemies, player);
            this.player.tryReleaseEnemy(this.enemies);
        }
    }
}

export const characters = new Characters();
