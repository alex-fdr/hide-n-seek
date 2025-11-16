import GUI from 'lil-gui';

export class DebugSceneTree {
    constructor(onActionComplete) {
        this.onActionComplete = onActionComplete;
        this.exclude = ['transform-controls', 'TransformControlsGizmo'];
        this.keepClosed = ['mixamorig_Hips'];
    }

    action(context) {
        this.panel = new GUI({ title: 'Scene Tree', width: 200 });
        this.panel.domElement.style.right = '0px';

        this.lightsFolder = this.panel.addFolder('Lights');

        this.tweakPanelStyle();

        for (const child of context.scene.children) {
            this.traverseScene(child, this.panel);
        }
    }

    tweakPanelStyle() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .lil-gui {
                --folder-indent: 8px;
            }
            .lil-title:has(+ .lil-children:empty)::before {
                content: '';
            }
            .lil-title ~ .lil-children:empty {
                display: none;
            }
            .lil-gui .lil-title:before {
                display: inline;
            }
        `;
        document.head.appendChild(styleElement);
    }

    traverseScene(object, parentFolder) {
        const name = object.name !== '' ? object.name : object.type;

        if (this.exclude.includes(name)) {
            return;
        }

        const parent = object.isLight ? this.lightsFolder : parentFolder;
        const folder = parent.addFolder(name);

        folder.domElement
            .querySelector('.lil-title')
            .addEventListener('click', () => {
                this.onActionComplete?.(object, name);
            });

        if (this.keepClosed.includes(name) || object.isLight || object.isMesh) {
            folder.close();
        }

        // recursively traverse children of the current node
        for (const child of object.children) {
            this.traverseScene(child, folder);
        }
    }

    toggle(status, context) {
        if (!this.panel) {
            this.action(context);
        }

        this.panel.show(status);
        context.components?.props.adjustPlacement(status);
    }
}
