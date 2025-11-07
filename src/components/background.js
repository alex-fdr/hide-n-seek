import bgSand from '../assets/images/bg-sand.jpg';
import bgSky from '../assets/images/bg-sky-clouds.jpg';

export class Background {
    constructor() {
        this.domElement = document.getElementById('game');
        this.supportedImages = {
            'bg-sky-clouds': bgSky,
            'bg-sand': bgSand,
        };
    }

    init(props) {
        const { image } = props;
        this.domElement.classList.add(`img-${image}`);
        this.domElement.style.backgroundImage = `url(${this.supportedImages[image]})`;
        this.domElement.style.backgroundSize = 'cover';
        this.domElement.style.backgroundPosition = 'center';
    }
}

export const background = new Background();
