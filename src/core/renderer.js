import { WebGLRenderer } from 'three';

export class Renderer extends WebGLRenderer {
    constructor(props) {
        const { width, height, color, opacity } = props;
        super(props);

        this.setSize(width, height);
        this.setClearColor(color, opacity);

        document.getElementById('game').append(this.domElement);
    }

    resize(width, height) {
        this.setSize(width, height);
    }
}
