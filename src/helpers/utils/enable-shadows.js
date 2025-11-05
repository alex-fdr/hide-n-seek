import { CameraHelper, PCFShadowMap } from 'three';
import { applyTransform } from './apply-transform';

export function enableShadows(renderer, scene, props = {}) {
    const {
        type = PCFShadowMap,
        mapSize = 1024,
        shadowCamera = {},
        shadowReceivePlane = {},
        debug = false,
    } = props;

    const {
        near = 1,
        far = 50,
        left = -10,
        right = 10,
        top = 10,
        bottom = -10,
    } = shadowCamera;

    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = type;

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
        createShadowReceivePlane(shadowReceivePlane);
    }
}

function createShadowReceivePlane(shadowPlane) {
    const { color = 0x000000, opacity = 0.5 } = shadowPlane;
    const geometry = new PlaneGeometry(1, 1);
    const material = new ShadowMaterial({
        color,
        opacity,
        transparent: false,
        side: DoubleSide,
    });

    const plane = new Mesh(geometry, material);
    plane.receiveShadow = true;
    plane.name = 'shadows-receiver';
    plane.position.set(0, 0.1, 0);
    scene.add(plane);

    applyTransform(plane, shadowPlane);

    return plane;
}
