import bgSand from '../assets/images/bg-sand.jpg';
import bgSky from '../assets/images/bg-sky-clouds.jpg';

export class Background {
    constructor() {
        this.domElement = document.getElementById('game');
    }

    init(props) {
        const { image } = props;
        this.domElement.classList.add(`img-${image}`);
        this.domElement.style.backgroundImage = `url(${bgSky})`;

        const style = this.domElement.style;
        style.backgroundSize = 'cover';
        style.backgroundPosition = 'center';
    }
}

export const background = new Background();