import { applyTransform } from '@alexfdr/three-game-utils';
import { CameraHelper, FrontSide, Mesh, PCFShadowMap, PlaneGeometry, ShadowMaterial } from 'three';

export class ShadowsHelper {
    constructor(renderer, scene, props = {}) {
        this.renderer = renderer;
        this.scene = scene;
        this.light = scene.getObjectByProperty('type', 'DirectionalLight');

        this.shadowPlane = props.shadowPlane ? this.createShadowPlane(props.shadowPlane) : null;

        this.setupRenderer();
        this.setupDirectionalLight(props.mapSize, props.shadowCamera);

        if (props.debug) {
            this.setupDebugStuff();
        }
    }

    setupRenderer() {
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = PCFShadowMap;
    }

    setupDirectionalLight(mapSize = 1024, shadowCameraProps = {}) {
        const {
            near = 0.1,
            far = 100,
            left = -10,
            right = 10,
            top = 10,
            bottom = -10,
        } = shadowCameraProps;

        this.light.castShadow = true;

        const shadow = this.light.shadow;
        shadow.radius = 2;
        shadow.mapSize.width = mapSize;
        shadow.mapSize.height = mapSize;

        const camera = shadow.camera;
        camera.near = near;
        camera.far = far;
        camera.left = left;
        camera.right = right;
        camera.top = top;
        camera.bottom = bottom;
    }

    setupDebugStuff() {
        const helper = new CameraHelper(this.light.shadow.camera);
        this.scene.add(helper);
    }

    createShadowPlane(props) {
        const { color = 0x000000, opacity = 0.5 } = props;
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
        this.scene.add(plane);

        console.log('shadow plane', plane);

        applyTransform(plane, props);

        return plane;
    }
}
