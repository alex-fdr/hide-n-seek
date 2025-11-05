export class DebugScene {
    constructor(gui, onActionComplete) {
        this.gui = gui;
        this.counter = 0;
        this.onActionComplete = onActionComplete;
    }

    action(context) {
        if (this.root) {
            return;
        }

        const root = this.gui.addFolder('Scene');
        root.open();
        this.root = root;

        context.scene.children.forEach((child) => this.traverseScene(child, root));
    }

    toggle(status, context) {
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
        if (child?.children) {
            if (child.name !== 'transform-controls' && child.type !== 'TransformControlsGizmo') {
                let name = child.name !== '' ? child.name : child.type;

                if (child.isMesh) {
                    parentFolder
                        .add({ click: this.click.bind(this, child, name) }, 'click')
                        .name(name);

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

                folder.open();

                // handle click on folder
                folder.domElement
                    .querySelector('.lil-title')
                    .addEventListener('click', this.click.bind(this, child, name));

                child.children.forEach((c) => this.traverseScene(c, folder));
            }
        }
    }

    click(target) {
        if (this.onActionComplete) {
            this.onActionComplete(target);
        }
    }
}
