import CannonDebugger from 'cannon-es-debugger';

export class DebugPhysics {
    constructor() {
        this.debugger = null;
        this.meshes = [];
    }

    action({ scene, physics }) {
        this.debugger = new CannonDebugger(scene, physics.world, {
            onInit: (_, mesh) => this.meshes.push(mesh),
        });
    }

    toggle(status, context) {
        if (!this.debugger) {
            this.action(context);
        }

        for (const mesh of this.meshes) {
            mesh.visible = status;
        }
    }

    update() {
        this.debugger?.update();
    }
}
