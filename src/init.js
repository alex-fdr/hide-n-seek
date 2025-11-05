import { Game } from './game';

const game = new Game({
    width: window.innerWidth,
    height: window.innerHeight,
});

const createTime = Date.now();

window.addEventListener('load', () => {
    // a small delay so the loading animation can be seen
    const waitTime = Math.max(Date.now() - createTime, 500);

    setTimeout(() => {
        game.load();
    }, waitTime);
});