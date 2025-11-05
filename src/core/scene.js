import { AmbientLight, Scene as BaseScene, Color, DirectionalLight, Fog, HemisphereLight } from 'three';

export class Scene extends BaseScene {
    constructor(props) {
        const { bg } = props;

        super();

        if (bg) {
            this.background = new Color(bg);
        }

        this.name = 'root';
        this.lights = [];

        if (props.lights) {
            this.addLights(props.lights);
        }

        if (props.fog) {
            this.addFog(props.fog);
        }
    }

    addFog(props) {
        const { color = '#ffffff', near = 1, far = 100 } = props;
        this.fog = new Fog(color, near, far);
    }

    addLights(lightsSettings = []) {
        for (const props of lightsSettings) {
            const { type } = props;
            const light = this.createLightInstance(type, props);

            if (props.data.position) {
                light.position.copy(props.data.position);
            }

            this.add(light);
            this.lights.push(light);
        }
    }

    createLightInstance(type, props) {
        switch (type) {
            case 'directional':
                return new DirectionalLight(props.color, props.intensity);
            case 'hemisphere':
                return new HemisphereLight(props.skyColor, props.groundColor, props.intensity);
            case 'ambient':
                return new AmbientLight(props.color, props.intensity);
            default:
                return new AmbientLight('#ff0000', 1);
        }
    }
}
