export const level1 = {
    color: 0xff0000,

    player: {
        position: { x: 0, y: 0.1, z: 0 },
        positionHider: { x: 1, y: 0, z: 4.5 },
    },

    aiSeeker: {
        color: '#ff56e9',
        speed: 0.9,
        size: 1,
        spawn: {
            position: { x: 0, y: 0, z: 0 },
        },
        route: {
            points: [
                [0, 0, 0.5],
                [0, 0, 1],
                [5, 0, 1],
                [4, 0, 5],
                [1, 0, 2],
                [-1.5, 0, 2],
                [-4.5, 0, 3.5],
                [-5, 0, 0],
                [-5, 0, -4.5],
                [-3.5, 0, -4],
                [-3, 0, 0],
            ],
        },
    },

    enemies: [
        {
            color: '#0556e9',
            name: 'blue',
            speed: 1.0,
            spawn: {
                position: { x: 1.5, y: 0, z: 1 },
            },
            route: {
                points: [
                    [1.3, 0, 4.6],
                    [-1.4, 0, 5.2],
                    [-4.8, 0, 5.2],
                    [-5.0, 0, 2.2],
                    [-5.0, 0, 0.0],
                    [-4.0, 0, 0.0],
                ],
            },
        },
        {
            color: '#ff6228',
            name: 'orange',
            speed: 1.0,
            spawn: {
                position: { x: 1.5, y: 0, z: 1 },
            },
            route: {
                points: [
                    [-3.5, 0, -4.2],
                    [2.8, 0, -4.2],
                    [2.6, 0, -2.5],
                    [4.0, 0, -1],
                    [5.0, 0, -4],
                    [3.0, 0, -4],
                    [2.0, 0, -3],
                    [-3.5, 0, -3],
                    [-3.5, 0, -4.2],
                ],
            },
        },
        {
            color: '#118822',
            name: 'green',
            speed: 1.0,
            spawn: {
                position: { x: 1.5, y: 0, z: 1 },
            },
            route: {
                points: [
                    [4.5, 0, -2],
                    [5, 0, 5],
                    [3, 0, 4.5],
                    [2, 0, 2.5],
                    [4.5, 0, 1],
                    [3.5, 0, 3],
                ],
            },
        },
        {
            color: '#eeb0fe',
            name: 'purple',
            speed: 1.0,
            spawn: {
                position: { x: 1.5, y: 0, z: 1 },
            },
            route: {
                points: [
                    [1, 0, -3],
                    [0.5, 0, -1.6],
                    [-3, 0, -1.3],
                    [-3, 0, 0],
                    [-5, 0, 0],
                    [-5, 0, -4],
                ],
            },
        },
    ],
};
