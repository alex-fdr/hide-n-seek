export default {
    default: {
        hintTimeout: {
            type: 'float',
            title: 'Show hint after X seconds of inactivity.',
            value: 1,
            min: 0,
            max: 10,
            step: 0.1,
            hidden: true,
        },
        sqTimeout: {
            type: 'float',
            title: 'Show SQ after X seconds after first intercation.',
            value: 0,
            min: 0,
            max: 10,
            step: 0.1,
            hidden: true,
        },
        sqInteraction: {
            type: 'int',
            title: 'SQ on X move (amount).',
            value: 0,
            min: 0,
            max: 20,
            step: 1,
            hidden: true,
        },
        attempts: {
            type: 'int',
            title: 'Amount of attempts.',
            value: 0,
            min: 0,
            max: 20,
            step: 1,
            hidden: true,
        },
        enableAmazing: {
            type: 'bool',
            title: 'Enable Amazing screen?',
            value: false,
            hidden: true,
        },
        enableWasted: {
            type: 'bool',
            title: 'Enable Wasted screen?',
            value: false,
            hidden: true,
        },
        enableRetry: {
            type: 'bool',
            title: 'Show retry screen after fail?',
            value: false,
            hidden: true,
        },
        autoRetry: {
            type: 'bool',
            title: 'Restart automatically after fail?',
            value: false,
            hidden: true,
        },
        nextLevelAfterLose: {
            type: 'bool',
            title: 'Load next level after fail?',
            value: false,
            hidden: true,
        },
        sqOnLastLevel: {
            type: 'bool',
            title: 'Show fake level after win/lose',
            value: false,
            hidden: true,
        },
        sqOnTutorial: {
            type: 'bool',
            title: 'First click on tutorial leads to store',
            value: false,
            hidden: true,
        },
        sqScreens: {
            type: 'list',
            title: 'Click on screen leads to store',
            value: ['win', 'lose'],
            hidden: true,
        },
        autoConvertScreens: {
            type: 'object',
            title: 'Autoconvert screens. E.G.: { win: 2 }',
            value: {
                win: 0,
                lose: 0,
            },
        },
        levels: {
            type: 'list',
            title: 'Levels.',
            value: ['level1'],
        },
        disableDelayedConvert: {
            type: 'bool',
            title: "If user didn't interacted last 6 sec - disable superquick",
            value: true,
        },
        disableEndGame: {
            type: 'bool',
            title: 'Disable EndGame event for Vungle?',
            value: false,
        },
    },

    timer: {
        duration: {
            title: 'Timer duration',
            type: 'int',
            value: 10,
            min: 5,
            max: 20,
            step: 1,
        },
        startFrom: {
            title: 'Start from',
            type: 'enum',
            value: 'interaction',
            options: {
                interaction: 'first interaction',
                game: 'game',
            },
        },
        appear: {
            title: 'Appear from',
            type: 'enum',
            value: 'game',
            options: {
                interaction: 'first interaction',
                game: 'game',
            },
        },
    },

    game: {
        outlineColor: {
            title: 'Outline color',
            type: 'color',
            value: '#000000',
        },
        wallsColor: {
            title: 'Walls color',
            type: 'color',
            value: '#FFD5C2',
        },
        groundColor: {
            title: 'Ground color',
            type: 'color',
            value: '#F0F757',
        },
        background: {
            title: 'Bg image',
            type: 'enum',
            value: 'bg-sky-clouds',
            options: {
                'bg-sky-clouds': 'sky clounds',
                'bg-sand': 'sand',
            },
        },
    },

    overlay: {
        enabled: {
            title: 'Enabled',
            type: 'bool',
            value: false,
        },
        opacity: {
            title: 'Opacity',
            type: 'int',
            value: 0.5,
            min: 0.1,
            max: 0.9,
            step: 0.1,
        },
    },

    camera: {
        preset: {
            title: 'Preset',
            type: 'enum',
            value: 'default',
            options: {
                default: 'default',
                full: 'full field',
                threeQuarters: '3/4 field',
            },
        },
    },

    player: {
        role: {
            title: 'Role',
            type: 'enum',
            value: 'seeker',
            options: {
                seeker: 'Seeker',
                hider: 'Hider',
            },
        },
        model: {
            title: 'Model',
            type: 'enum',
            value: 'stickman',
            options: {
                stickman: 'Stickman',
                tiger: 'Tiger',
            },
        },
        size: {
            title: 'Size',
            type: 'int',
            value: 1,
            min: 0.5,
            max: 3,
            step: 0.1,
        },
        outline: {
            title: 'Outline',
            type: 'bool',
            value: true,
        },
        color: {
            title: 'Color for stickman',
            type: 'color',
            value: '#959595',
        },
    },

    aiSeeker: {
        model: {
            title: 'Model',
            type: 'enum',
            value: 'tiger',
            options: {
                stickman: 'Stickman',
                tiger: 'Tiger',
            },
        },
        size: {
            title: 'Size',
            type: 'int',
            value: 2,
            min: 0.5,
            max: 3,
            step: 0.1,
        },
        outline: {
            title: 'Outline',
            type: 'bool',
            value: true,
        },
        color: {
            title: 'Color',
            type: 'color',
            value: '#ff56e9',
        },
    },

    enemies: {
        //   outline: {
        //     title: 'Outline',
        //     type: 'bool',
        //     value: true
        //   },
        size: {
            title: 'Enemies size',
            type: 'int',
            value: 1,
            min: 0.5,
            max: 3,
            step: 0.1,
        },
    },

    enemy1: {
        enabled: {
            title: 'Enabled',
            type: 'bool',
            value: true,
        },
        outline: {
            title: 'Outline',
            type: 'bool',
            value: true,
        },
        color: {
            title: 'Color',
            type: 'color',
            value: '#0556e9',
        },
    },

    enemy2: {
        enabled: {
            title: 'Enabled',
            type: 'bool',
            value: true,
        },
        outline: {
            title: 'Outline',
            type: 'bool',
            value: true,
        },
        color: {
            title: 'Color',
            type: 'color',
            value: '#ff6228',
        },
    },

    enemy3: {
        enabled: {
            title: 'Enabled',
            type: 'bool',
            value: true,
        },
        outline: {
            title: 'Outline',
            type: 'bool',
            value: true,
        },
        color: {
            title: 'Color',
            type: 'color',
            value: '#118822',
        },
    },

    enemy4: {
        enabled: {
            title: 'Enabled',
            type: 'bool',
            value: true,
        },
        outline: {
            title: 'Outline',
            type: 'bool',
            value: true,
        },
        color: {
            title: 'Color',
            type: 'color',
            value: '#d660f5',
        },
    },
};
