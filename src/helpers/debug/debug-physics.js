import CannonDebugger from 'cannon-es-debugger';

export class DebugPhysics {
    constructor(world) {
        this.debugger = null;
        this.meshes = [];
        this.world = world;
    }

    action({ scene }) {
        this.debugger = new CannonDebugger(scene, this.world, {
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
