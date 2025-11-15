import { OrbitControls } from 'three/addons/controls/OrbitControls';

export class DebugOrbitControls {
    constructor() {
        this.controls = null;
    }

    action({ camera, renderer }) {
        this.controls = new OrbitControls(camera, renderer.domElement);
        this.controls.update();
    }

    toggle(status, context) {
        if (!this.controls) {
            this.action(context);
        }

        this.controls.enabled = status;
    }

    update() {
        this.controls?.update();
    }
}
