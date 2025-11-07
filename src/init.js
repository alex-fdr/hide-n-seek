import { Game } from './game';

const game = new Game();

window.addEventListener('load', () => {
    game.start({
        width: window.innerWidth,
        height: window.innerHeight,
    });
});
