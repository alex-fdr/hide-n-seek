import { NaiveBroadphase, World } from 'cannon-es';

export class Physics {
    constructor(config, scene) {
        const { gravity, debug = false } = config;

        this.timeStep = 1 / 60;
        this.lastCallTime = 0;
        this.maxSubSteps = 3;

        this.world = new World();
        this.world.broadphase = new NaiveBroadphase();

        this.world.gravity.copy(gravity);

        if (debug) {
        }
    }

    syncMeshes() {}

    update(time) {
        if (!this.lastCallTime) {
            this.world.step(this.timeStep);
            this.lastCallTime = time;
            return;
        }

        const timeSinceLastCalled = (time - this.lastCallTime) / 1000;
        this.world.step(this.timeStep, timeSinceLastCalled, this.maxSubSteps);
        this.lastCallTime = time;

        this.syncMeshes();

        this.debugger?.update();
    }
}
