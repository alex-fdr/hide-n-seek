import { config } from '../data/config';
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
            config.playerRole === ROLE_HIDER
                ? this.addAISeeker(data.aiSeeker)
                : null;

        this.status = {
            caughtEnemies: 0,
        };
    }

    addPlayer(data) {
        const skinType = config.playerModel;
        const role = config.playerRole;
        return new Player({
            skinType,
            size: config.playerSize,
            color: config.playerColor,
            animationsList: gameSettings.skins[skinType].animations,
            position: role === ROLE_HIDER ? data.positionHider : data.position,
            parent: this.parent,
        });
    }

    addEnemies(data) {
        const newEnemiesData = [];

        for (let i = 0; i < data.length; i++) {
            const key = `enemy${i + 1}`;
            const newColor = config[`${key}Color`];
            const isEnabled = config[`${key}Enabled`];
            if (isEnabled) {
                newEnemiesData.push({
                    ...data[i],
                    index: i,
                    color: newColor,
                    size: config.enemiesSize,
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
        const skinType = config.aiSeekerModel;
        const aiSeeker = new AISeeker({
            ...data,
            size: config.aiSeekerSize,
            color: config.aiSeekerColor,
            skinType,
            animationsList: gameSettings.skins[skinType].animations,
            parent: this.parent,
        });
        aiSeeker.tutorialAnimation();
        return aiSeeker;
    }

    getPlayerMeshAndBody() {
        return {
            mesh: this.player.group,
            body: this.player.body,
        };
    }

    update(walls, dt, hasPlayerInteracted) {
        this.player?.update(dt, walls, this.enemies);
        this.enemies?.update(dt);
        this.aiSeeker?.update(dt);

        if (this.player && this.enemies) {
            this.player.sightRange?.update(walls, this.enemies);
        }

        if (this.aiSeeker && this.player && this.enemies) {
            this.aiSeeker.sightRange?.update(
                walls,
                this.enemies,
                hasPlayerInteracted ? this.player : null,
            );
            this.player.tryReleaseEnemy(this.enemies);
        }
    }
}
