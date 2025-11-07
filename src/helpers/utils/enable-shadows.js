import {
    CameraHelper,
    FrontSide,
    Mesh,
    PCFShadowMap,
    PlaneGeometry,
    ShadowMaterial,
} from 'three';
import { applyTransform } from './apply-transform';

export function enableShadows(renderer, scene, props = {}) {
    const {
        mapSize = 1024,
        shadowCamera = {},
        shadowReceivePlane = {},
        debug = false,
    } = props;

    const {
        near = 0.1,
        far = 100,
        left = -10,
        right = 10,
        top = 10,
        bottom = -10,
    } = shadowCamera;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = PCFShadowMap;

    const light = scene.getObjectByProperty('type', 'DirectionalLight');
    light.castShadow = true;

    light.shadow.radius = 2;
    light.shadow.mapSize.width = mapSize;
    light.shadow.mapSize.height = mapSize;
    light.shadow.camera.near = near;
    light.shadow.camera.far = far;
    light.shadow.camera.left = left;
    light.shadow.camera.right = right;
    light.shadow.camera.top = top;
    light.shadow.camera.bottom = bottom;

    if (debug) {
        const helper = new CameraHelper(light.shadow.camera);
        scene.add(helper);
    }

    if (shadowReceivePlane?.enabled) {
        createShadowReceivePlane(scene, shadowReceivePlane);
    }
}

function createShadowReceivePlane(parent, shadowPlane) {
    const { color = 0x000000, opacity = 0.5 } = shadowPlane;
    const geometry = new PlaneGeometry(1, 1);
    const material = new ShadowMaterial({
        color,
        opacity,
        transparent: true,
        side: FrontSide,
    });

    const plane = new Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.name = 'shadows-receiver';
    // plane.position.set(0, 0.5, 0);
    parent.add(plane);

    console.log('shadow plane', plane);

    applyTransform(plane, shadowPlane);

    return plane;
}
