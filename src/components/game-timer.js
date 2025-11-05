// hidden timer to count time from game start
class GameTimer {
    constructor() {
        this.startTime = 0;
        this.currentTime = 0;
    }

    init() {
        this.startTime = performance.now();
    }

    update() {
        if (this.startTime) {
            this.currentTime = performance.now();
        }
    }

    getElapsedTime() {
        return this.currentTime - this.startTime;
    }

    getElapsedTimeInSeconds() {
        const time = this.getElapsedTime();
        const timeInSeconds = Math.floor(time / 1000) + 1; // start from 1s, not 0
        return timeInSeconds;
    }
}

export const gameTimer = new GameTimer();
