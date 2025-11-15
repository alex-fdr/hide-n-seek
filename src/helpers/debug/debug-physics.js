import CannonDebugger from '../../libs/cannon-es-debugger';

export class DebugPhysics {
    constructor() {
        this.debugger = null;
    }

    action({ scene, physics }) {
        this.debugger = new CannonDebugger(scene, physics.world);
    }

    toggle(status, context) {
        if (!this.debugger) {
            this.action(context);
        }

        for (const mesh of this.debugger.meshes) {
            mesh.visible = status;
        }
    }

    update() {
        this.debugger?.update();
    }
}
