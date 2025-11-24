import {
    MeshBasicMaterial,
    MeshLambertMaterial,
    MeshPhongMaterial,
    MeshStandardMaterial,
} from 'three';

class MaterialManager {
    constructor() {
        this.cache = {};
        this.propsToCopy = [
            'blending',
            'color',
            'colorWrite',
            'depthTest',
            'depthWrite',
            'emissive',
            'emissiveIntencity',
            'map',
            'morphTargets',
            'name',
            'opacity',
            'side',
            'skinning',
            'shininess',
            'specular',
            'transparent',
            'vertexColors',
            'wireframe',
            'flatShading',
        ];
    }

    add(type, props = {}) {
        switch (type.toLowerCase()) {
            case 'basic':
                return new MeshBasicMaterial(props);
            case 'phong':
                return new MeshPhongMaterial(props);
            case 'lambert':
                return new MeshLambertMaterial(props);
            case 'standard':
                return new MeshStandardMaterial(props);
            default:
                return new MeshLambertMaterial(props);
        }
    }

    replace(target, type = 'lambert', props = {}, clone = false) {
        const handler = (material) => {
            if (!this.cache[material.uuid]) {
                material = clone ? material.clone() : material;
                const newMaterial = this.copyProperties(
                    material,
                    this.add(type),
                    props,
                );
                this.cache[material.uuid] = newMaterial;
            }

            return this.cache[material.uuid];
        };

        this.traverse(target, handler, true);
    }

    change(target, props = {}) {
        if (!target) {
            return;
        }

        const handler = (material) => {
            this.copyProperties(material, material, props);
        };

        if (target.isMaterial) {
            handler(target);
            return;
        }

        this.traverse(target, handler, false);
    }

    traverse(target, callback, rewrite = false) {
        target.traverse((child) => {
            if (child.isMesh) {
                let result = [];

                if (child.material.length) {
                    result = child.material.map((material) =>
                        callback(material, child),
                    );
                } else {
                    result = callback(child.material, child);
                }

                if (rewrite) {
                    child.material = result;
                }
            }

            if (child.isSkinnedMesh) {
                child.material.skinning = true;
            }
        });
    }

    copyProperties(materialOld, materialNew, extraProps) {
        const applyProp = (material, key) => {
            let value =
                extraProps[key] || extraProps[key] >= 0
                    ? extraProps[key]
                    : materialOld[key];

            if (key === 'map' && extraProps.map === null) {
                value = extraProps.map;
            }

            if (key === 'color' || key === 'emissive' || key === 'specular') {
                this.copyColorProperties(material, key, value);
            } else if (key === 'shininess' && !extraProps[key]) {
                value = 0;
            } else {
                material[key] = value;
            }
        };

        this.propsToCopy.forEach((key) => {
            if (Object.hasOwn(materialNew, key)) {
                applyProp(materialNew, key);
            }
        });

        return materialNew;
    }

    copyColorProperties(material, key, value) {
        if (value || value >= 0) {
            if (value.isColor) {
                material[key].copy(value);
            } else if (typeof value === 'number') {
                material[key].setHex(value);
            } else if (typeof value === 'string') {
                material[key].setStyle(value);
            }
        }
    }
}

export const materials = new MaterialManager();
