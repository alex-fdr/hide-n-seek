import { utils } from '@alexfdr/three-game-core';
import { Game } from './game';

const game = new Game();

window.addEventListener('load', () => {
    const { width, height } = utils.getScreenSize();
    game.start({ width, height });
});
