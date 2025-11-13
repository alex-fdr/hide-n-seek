import { Body } from 'cannon-es';
import {
    BackSide,
    ClampToEdgeWrapping,
    DoubleSide,
    FrontSide,
    MirroredRepeatWrapping,
    RepeatWrapping,
} from 'three';

export class DebugShowSceneObjectProps {
    constructor(gui) {
        this.gui = gui;
        this.root = null;
        this.visible = false;
        this.targetObjectPropsUuid = 0;
        this.items = [];
        this.lightTypes = [
            'DirectionalLight',
            'AmbientLight',
            'HemisphereLight',
            'SpotLight',
        ];
    }

    create() {
        this.root = this.gui.addFolder('Object props');
        this.root.close();
        this.root.show();
        this.visible = true;
    }

    action(context, target) {
        if (!target) {
            this.create();
            return;
        }

        if (!this.visible) {
            return;
        }

        if (this.root) {
            // check if we already show props for this object
            if (this.targetObjectPropsUuid === target.uuid) {
                return;
            }
            this.targetObjectPropsUuid = target.uuid;
            this.clearRootFolder();
        } else {
            this.root = this.gui.addFolder('Object props');
        }

        // set folder name based on what is the target object
        this.root.name = target.name || target.type || 'Object';
        this.root.name += ' props';

        const parsers = {
            light: (obj) => this.showLightProps(obj),
            material: (obj) => {
                if (obj.material.length) {
                    obj.material.forEach((m, i) => {
                        this.showMaterialProps(obj, m, i);
                    });
                } else {
                    this.showMaterialProps(obj, obj.material);
                }
            },
            body: (obj) => this.showPhysicsBodyProps(obj),
            group: (obj) => this.showGroupProps(obj),
        };

        // apply props parser
        if (this.lightTypes.includes(target.type)) {
            parsers.light(target);
        } else if (target.material) {
            parsers.material(target);
        } else if (target.isGroup || target.isObject3D) {
            parsers.group(target);
        }

        if (target.body) {
            parsers.body(target);
        }

        this.root.open();
    }

    clearRootFolder() {
        const folders = this.root.folders;
        const controllers = this.root.controllers;
        Object.keys(folders).forEach((key) => folders[key].destroy());
        controllers.forEach((ctrl) => ctrl.destroy());
    }

    showLightProps(target) {
        const folder = this.root.addFolder('Light');
        this.handleColor(folder, target, 'color');
        this.handleColor(folder, target, 'groundColor');
        folder.add(target, 'intensity', 0, 2, 0.01);
    }

    showMaterialProps(target, material, materialIndex) {
        const name =
            materialIndex >= 0 ? `Material${materialIndex}` : 'Material';
        const folder = this.root.addFolder(name);
        folder.add(material, 'type');
        folder.add(target, 'visible');

        this.handleColor(folder, material, 'color');
        this.handleColor(folder, material, 'emissive');
        this.handleColor(folder, material, 'specular');

        folder.add(material, 'transparent');
        folder.add(material, 'opacity', 0, 1);
        folder
            .add(material, 'side', {
                FrontSide: FrontSide,
                BackSide: BackSide,
                DoubleSide: DoubleSide,
            })
            .onChange((val) => (material.side = +val));

        if (material.wireframe) {
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
                ClampToEdgeWrapping: ClampToEdgeWrapping,
                RepeatWrapping: RepeatWrapping,
                MirroredRepeatWrapping: MirroredRepeatWrapping,
            })
            .onChange((val) => {
                texture.wrapS = +val;
                texture.wrapT = +val;
                texture.needsUpdate = true;
            })
            .name('wrap');

        // folder
        //     .add(texture, 'encoding', {
        //         LinearEncoding: THREE.LinearEncoding,
        //         sRGBEncoding: THREE.sRGBEncoding,
        //         GammaEncoding: THREE.GammaEncoding,
        //     })
        //     .onChange((val) => {
        //         texture.encoding = +val;
        //         material.needsUpdate = true;
        //     });

        folder.open();
    }

    showPhysicsBodyProps(target) {
        const { body } = target;
        const folder = this.root.addFolder('Body');

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

        folder.open();
    }

    showGroupProps(target) {
        this.root.add(target, 'visible');
    }

    handleVector3(parentFolder, target, key) {
        const vec3 = target[key];
        const subFolder = parentFolder.addFolder(key);
        subFolder.add(vec3, 'x');
        subFolder.add(vec3, 'y');
        subFolder.add(vec3, 'z');
        subFolder.open();
    }

    handleColor(parentFolder, target, key) {
        const props = {};
        props[key] = target[key] ? target[key].getHex() : false;
        if (props[key] !== false) {
            parentFolder
                .addColor(props, key)
                .onChange((color) => target[key].set(color));
        }
    }

    handleFunction(parentFolder, key, callback) {
        const obj = {
            add: () => callback(),
        };
        parentFolder.add(obj, 'add').name(key);
    }

    toggle(status) {
        if (!this.root) {
            this.visible = true;
            this.action();
            return;
        }

        if (status) {
            this.root.show();
        } else {
            this.root.hide();
        }

        this.visible = status;
    }
}
