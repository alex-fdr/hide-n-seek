import { WebGLRenderer } from 'three';

export class Renderer extends WebGLRenderer {
    constructor(props) {
        const { width, height, color, opacity, parentId } = props;
        super(props);

        this.setSize(width, height);
        this.setClearColor(color, opacity);

        document.getElementById(parentId).append(this.domElement);
    }

    resize(width, height) {
        this.setSize(width, height);
    }
}
