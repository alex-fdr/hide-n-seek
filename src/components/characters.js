import config from '../assets/settings/config';
import { ROLE_HIDER, SKIN_STICKMAN } from '../data/game-const';
import { gameSettings } from '../data/game-settings';
import { AISeeker } from './enemy/ai-seeker';
import { EnemiesCollection } from './enemy/enemies-collection';
import { Player } from './player/player';

export class Characters {
    constructor({ parent, data }) {
        this.parent = parent;
        this.player = this.addPlayer(data.player);
        this.enemies = this.addEnemies(data.enemies);
        this.aiSeeker =
            config.player.role.value === ROLE_HIDER
                ? this.addAISeeker(data.aiSeeker)
                : null;

        this.status = {
            caughtEnemies: 0,
        };
    }

    // init(playerData, enemiesData, aiSeekerData) {
    //     const role = config.player.role.value;

    //     if (role === 'seeker') {
    //         // do smth here
    //     } else if (role === 'hider') {
    //         this.addAISeeker(aiSeekerData);
    //         // make player catchable
    //         // add it to enemies list or smth else
    //     }
    // }

    addPlayer(data) {
        const skinType = config.player.model.value;
        const size = config.player.size.value;
        const color = config.player.color.value;
        const role = config.player.role.value;
        const { position, positionHider } = data;

        return new Player({
            size,
            color,
            skinType,
            animationsList: gameSettings.skins[skinType].animations,
            position: role === ROLE_HIDER ? positionHider : position,
            parent: this.parent,
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
                    skinType: SKIN_STICKMAN,
                });
            }
        }

        return new EnemiesCollection({
            parent: this.parent,
            data: newEnemiesData,
        });
    }

    addAISeeker(data) {
        const type = config.aiSeeker.model.value;
        const size = config.aiSeeker.size.value;
        const color = config.aiSeeker.color.value;
        const newData = { ...data, size, color, type };

        const aiSeeker = new AISeeker({
            ...newData,
            animationsList: gameSettings.skins[type].animations,
            parent: this.parent,
        });
        // this.aiSeeker.tutorialAnimation()
        // this.aiSeeker.activate()
        return aiSeeker;
    }

    getPlayerMeshAndBody() {
        return {
            mesh: this.player.group,
            body: this.player.body,
        };
    }

    update(walls, dt, hasPlayerInteracted) {
        this.player?.update(dt);
        this.enemies?.update(dt);
        this.aiSeeker?.update(dt);

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
