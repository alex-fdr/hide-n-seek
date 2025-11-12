import { core } from '@alexfdr/three-game-core';
import { getScreenSize } from '@alexfdr/three-game-utils';
import { Game } from './game';

const game = new Game();

window.addEventListener('load', () => {
    const { width, height } = getScreenSize();
    game.start({ width, height });
});

window.addEventListener('resize', () => {
    const { width, height } = getScreenSize();
    core.resize(width, height);
    game.resize(width, height);
});
