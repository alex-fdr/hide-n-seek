import { Signal } from '../../core/signal';

const STATE = {
    game: 0,
    win: 1,
    lose: 2,
};

class SqHelper {
    constructor() {
        this.state = STATE.game;

        this.onWin = new Signal();
        this.onLose = new Signal();
    }

    levelWin() {
        if (this.levelComplete) return;

        this.state = STATE.win;
        // GM.trigger.end(true);

        this.onWin.dispatch();
    }

    levelLose() {
        if (this.levelComplete) return;

        // GM.trigger.interactionComplete();
        this.state = STATE.lose;
        // GM.trigger.end(false);

        this.onLose.dispatch();
    }

    // activateTimer() {
    //   setTimeout(() => {
    //     if (this.levelComplete) return;

    //     this.levelLose();
    //   }, GM.config.get('game.timeForSeek'));
    // }

    get levelComplete() {
        return this.state !== STATE.game;
    }
}

export const sqHelper = new SqHelper();
