import { Body } from 'cannon-es';
import GUI from 'lil-gui';
import {
    BackSide,
    ClampToEdgeWrapping,
    DoubleSide,
    FrontSide,
    MirroredRepeatWrapping,
    RepeatWrapping,
} from 'three';

export class DebugObjectProps {
    constructor() {
        this.title = 'Object Props';
        this.activeObjectUuid = 0;
        this.lightTypes = [
            'DirectionalLight',
            'AmbientLight',
            'HemisphereLight',
            'SpotLight',
        ];
    }

    createPanel() {
        return new GUI({ title: this.title, width: 200 });
    }

    adjustPlacement(visible) {
        if (!this.panel) {
            this.panel = this.createPanel();
            this.panel.hide();
        }

        this.panel.domElement.style.right = visible ? '200px' : '0px';
    }

    /* biome-ignore lint : keep unused 'context' parameter */
    action(context, target) {
        if (!this.panel) {
            this.panel = this.createPanel();
            this.panel.close();
            this.adjustPlacement(false);
        }

        if (!target) {
            console.log('no target was provided');
            return;
        }

        // check if we already shown props for this object
        if (this.activeObjectUuid === target.uuid) {
            this.panel.open();
            return;
        }

        this.activeObjectUuid = target.uuid;
        this.clearPanel();

        // set folder's name based on what the target object is
        const name = target.name || target.type || 'Object';
        this.panel.title(`${name} props`);
        this.panel.open();

        if (this.lightTypes.includes(target.type)) {
            this.showLightProps(target);
        }

        if (target.material) {
            const { material } = target;
            const materials = Array.isArray(material) ? material : [material];

            for (const [i, mat] of materials.entries()) {
                this.showMaterialProps(target, mat, i);
            }
        }

        if (target.children.length) {
            this.showGroupProps(target);
        }
    }

    clearPanel() {
        for (const child of this.panel.children) {
            child.destroy();
        }

        for (const folder of this.panel.folders) {
            folder.destroy();
        }

        for (const ctrl of this.panel.controllers) {
            ctrl.destroy();
        }
    }

    showLightProps(target) {
        // const folder = this.panel.addFolder('Light');
        this.handleColor(this.panel, target, 'color');
        this.handleColor(this.panel, target, 'groundColor');
        this.panel.add(target, 'intensity', 0, 3, 0.1);
    }

    showMaterialProps(target, material, materialId) {
        const name = materialId > 0 ? `Material${materialId}` : 'Material';
        const folder = this.panel.addFolder(name);
        folder.add(material, 'type');
        folder.add(target, 'visible');

        this.handleColor(folder, material, 'color');
        this.handleColor(folder, material, 'emissive');
        this.handleColor(folder, material, 'specular');

        folder.add(material, 'transparent');
        folder.add(material, 'opacity', 0, 1);
        folder
            .add(material, 'side', { FrontSide, BackSide, DoubleSide })
            .onChange((val) => {
                material.side = +val;
            });

        if (Object.hasOwn(material, 'wireframe')) {
            folder.add(material, 'wireframe');
        }

        if (material.color?.getHex()) {
            this.handleFunction(folder, 'LinearToSRGB', () =>
                material.color.convertLinearToSRGB(),
            );
            this.handleFunction(folder, 'SRGBToLinear', () =>
                material.color.convertSRGBToLinear(),
            );
        }

        if (material.map) {
            this.showMaterialTextureProps(folder, material);
        }
    }

    showMaterialTextureProps(parent, material) {
        const folder = parent.addFolder('Texture');
        const texture = material.map;

        folder.add(texture, 'flipY');
        folder
            .add(texture, 'rotation')
            .min(0)
            .max(Math.PI * 2)
            .step(0.01);
        folder
            .add(texture.offset, 'x')
            .name('offsetX')
            .min(0)
            .max(1)
            .step(0.01);
        folder
            .add(texture.offset, 'y')
            .name('offsetY')
            .min(0)
            .max(1)
            .step(0.01);
        folder.add(texture.repeat, 'x').name('repeatX');
        folder.add(texture.repeat, 'y').name('repeatY');

        folder
            .add(texture, 'wrapS', {
                ClampToEdgeWrapping,
                RepeatWrapping,
                MirroredRepeatWrapping,
            })
            .onChange((val) => {
                texture.wrapS = +val;
                texture.wrapT = +val;
                texture.needsUpdate = true;
            })
            .name('wrap');
    }

    showPhysicsBodyProps(target) {
        const { body } = target;
        const folder = this.panel.addFolder('Physical Body');

        folder.add(body, 'type', {
            dynamic: Body.DYNAMIC,
            static: Body.STATIC,
            kinematic: Body.KINEMATIC,
        });

        folder.add(body, 'mass');
        folder.add(body, 'angularDamping').min(0).max(1).step(0.01);
        folder.add(body, 'linearDamping').min(0).max(1).step(0.01);

        // this.handleVector3(folder, body, 'position');
        // this.handleVector3(folder, body, 'velocity');
        // this.handleVector3(folder, body, 'inertia');
        // this.handleVector3(folder, body, 'force');
    }

    showGroupProps(target) {
        this.panel.add(target, 'visible');
        // const pos = this.panel.addFolder('position');
        // pos.add(target.position, 'x');
        // pos.add(target.position, 'y');
        // pos.add(target.position, 'z');
    }

    // handleVector3(parentFolder, target, key) {
    //     const vec3 = target[key];
    //     const subFolder = parentFolder.addFolder(key);
    //     subFolder.add(vec3, 'x');
    //     subFolder.add(vec3, 'y');
    //     subFolder.add(vec3, 'z');
    // }

    handleColor(parentFolder, target, key) {
        const props = {};
        props[key] = target[key] ? target[key].getHex() : false;
        if (props[key] !== false) {
            parentFolder
                .addColor(props, key)
                .onChange((color) => target[key].set(color));
        }
    }

    handleFunction(parentFolder, label, callback) {
        const obj = { fn: () => callback() };
        parentFolder.add(obj, 'fn').name(label);
    }

    toggle(status) {
        if (!this.panel) {
            this.action();
        }

        this.panel.show(status);
    }
}
