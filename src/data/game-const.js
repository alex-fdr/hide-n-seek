export const CAMERA_SETTINGS = {
    default: {
        position: { x: 0, y: 12, z: 8 },
        rotation: { x: 0.1, y: 0, z: 0 },
        offset: { x: 0, y: 0, z: 0 },
    },

    threeQuarters: {
        position: { x: 0, y: 20, z: 6 },
        rotation: { x: 0.3, y: 0, z: 0 },
        offset: { x: 0, y: 0, z: 0 },
    },

    full: {
        position: { x: 0, y: 20, z: 6 },
        rotation: { x: 0.3, y: 0, z: 0 },
        offset: { x: 0, y: 5, z: 3 },
    },
};

export const ROLE_SEEKER = 'seeker';
export const ROLE_HIDER = 'hider';
export const ENEMY_TAG = 'enemy-collider';
export const PLAYER_TAG = 'player-collider';
export const SKIN_TIGER = 'tiger';
export const SKIN_STICKMAN = 'stickman';
export const STATUS_PLAYER_WIN = 'playerWin';
export const STATUS_PLAYER_LOSE = 'playerLose';
