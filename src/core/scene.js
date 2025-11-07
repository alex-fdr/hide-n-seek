import {
    AmbientLight,
    Scene as BaseScene,
    Color,
    DirectionalLight,
    Fog,
    HemisphereLight,
} from 'three';

export class Scene extends BaseScene {
    constructor(props) {
        super();

        const { bg, fog, lights } = props;
        this.name = 'root';
        this.lights = [];

        if (bg) this.addBackground(bg);
        if (lights) this.addLights(lights);
        if (fog) this.addFog(fog);
    }

    addBackground(color) {
        this.background = new Color(color);
    }

    addFog(props) {
        const { color = '#ffffff', near = 1, far = 100 } = props;
        this.fog = new Fog(color, near, far);
    }

    addLights(lightsSettings = []) {
        for (const props of lightsSettings) {
            const { type, data } = props;
            const light = this.createLightInstance(type, props);

            if (data.position) {
                light.position.copy(data.position);
            }

            this.add(light);
            this.lights.push(light);
        }
    }

    createLightInstance(type, props) {
        const { intensity, color, skyColor, groundColor } = props;
        switch (type) {
            case 'directional':
                return new DirectionalLight(color, intensity);
            case 'hemisphere':
                return new HemisphereLight(skyColor, groundColor, intensity);
            case 'ambient':
                return new AmbientLight(color, intensity);
            default:
                return new AmbientLight('#ff0000', 1);
        }
    }
}
