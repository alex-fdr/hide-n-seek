import CannonDebugger from 'cannon-es-debugger';

export class DebugPhysics {
    constructor({ scene, world }) {
        this.scene = scene;
        this.world = world;
        this.debugger = null;
        this.meshes = [];
    }

    init() {
        this.debugger = new CannonDebugger(this.scene, this.world, {
            onInit: (_, mesh) => {
                this.meshes.push(mesh);
            },
        });
    }

    toggle(status) {
        if (!this.debugger) {
            this.init();
        }

        for (const mesh of this.meshes) {
            mesh.visible = status;
        }
    }

    update() {
        this.debugger?.update();
    }
}
