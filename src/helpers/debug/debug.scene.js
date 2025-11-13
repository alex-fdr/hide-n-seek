export class DebugScene {
    constructor(gui, onActionComplete) {
        this.gui = gui;
        this.counter = 0;
        this.onActionComplete = onActionComplete;
        this.lights = [
            'DirectionalLight',
            'AmbientLight',
            'HemisphereLight',
            'SpotLight',
            'PerspectiveCamera',
        ];
        this.skipNames = ['transform-controls'];
        this.skipTypes = ['TransformControlsGizmo'];
        this.closeNames = ['mixamorig_Hips'];
    }

    action(context) {
        if (this.root) {
            return;
        }

        this.root = this.gui.addFolder('Scene tree');
        // this.root.open();

        for (const child of context.scene.children) {
            this.traverseScene(child, this.root);
        }

        // context.scene.children.forEach((child) => this.traverseScene(child, root));
    }

    toggle(status, context) {
        console.log('scene toggle');
        if (!this.root) {
            this.action(context);
        }

        if (status) {
            this.gui.show();
        } else {
            this.gui.hide();
        }
    }

    traverseScene(child, parentFolder) {
        if (!child.children) {
            console.log('child without children:', child.name, child.type);
            return;
        }

        if (this.skipNames.includes(child.name)) {
            console.log('skip name:', child.name);
            return;
        }

        if (this.skipTypes.includes(child.type)) {
            console.log('skip type:', child.type);
            return;
        }

        let name = child.name !== '' ? child.name : child.type;
        const onClick = this.click.bind(this, child, name);

        if (child.isMesh) {
            parentFolder.add({ click: onClick }, 'click').name(name);

            if (child.children.length === 0) {
                return;
            }
        }

        if (this.lights.includes(name)) {
            parentFolder.add({ click: onClick }, 'click').name(name);

            if (child.children.length === 0) {
                return;
            }
        }

        let folder;

        try {
            folder = parentFolder.addFolder(name);
        } catch (error) {
            this.counter++;
            name = `${name}_${this.counter}`;
            folder = parentFolder.addFolder(name);
        }

        if (this.closeNames.includes(name)) {
            folder.close();
        }

        // handle click on folder
        folder.domElement
            .querySelector('.lil-title')
            .addEventListener('click', onClick);

        for (const c of child.children) {
            this.traverseScene(c, folder);
        }
    }

    isLightsObject(el) {}

    click(target) {
        if (this.onActionComplete) {
            this.onActionComplete(target);
        }
    }
}
