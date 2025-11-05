export const gameSettings = {
    scene: {
        // bg: 0x75dabc,
        // fog: {
        //     color: 0x9ce6af,
        //     near: 2,
        //     far: 25,
        // },
        lights: [
            {
                type: 'directional',
                color: 0xffffff,
                intensity: 1,
                data: {
                    castShadow: true,
                    position: {
                        x: -2,
                        y: 10,
                        z: -2,
                    },
                    shadow: {
                        mapSize: {
                            width: 1024,
                            height: 1024,
                        },
                        camera: {
                            top: 10,
                            bottom: -10,
                            left: -10,
                            right: 10,
                            far: 50,
                        },
                    },
                },
            },
            {
                type: 'hemisphere',
                skyColor: 0xffffff,
                groundColor: 0xffffff,
                intensity: 0.9,
                data: {
                    position: {
                        x: 0,
                        y: 0,
                        z: 0,
                    },
                },
            },
        ],
    },
    renderer: {
        antialias: true,
        alpha: true,
        color: 0x000000,
        opacity: 0,
        shadow: true,
    },
    camera: {
        // orthographic: false,
        fov: {
            landscape: 30,
            portrait: 45,
        },
        near: 0.1,
        far: 2000,
        // shake: {
        //     span: 1,
        // },
        position: {
            x: 0,
            y: 15,
            z: 10,
        },
        // following: {
        //     enabled: true,
        //     lerp: 0.5,
        //     position: {
        //         x: 0,
        //         y: 0,
        //         z: 0,
        //     },
        // },
    },
    physics: {
        debug: false,

        gravity: {
            x: 0,
            y: -10,
            z: 0,
        },
    },
    debug: {},
};
