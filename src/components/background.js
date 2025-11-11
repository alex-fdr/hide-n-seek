import bgSand from '../assets/images/bg-sand.jpg';
import bgSky from '../assets/images/bg-sky-clouds.jpg';

export class Background {
    constructor({ image }) {
        this.supportedImages = {
            'bg-sky-clouds': bgSky,
            'bg-sand': bgSand,
        };

        this.domElement = document.getElementById('game');
        this.domElement.classList.add(`img-${image}`);
        this.domElement.style.backgroundImage = `url(${this.supportedImages[image]})`;
        this.domElement.style.backgroundSize = 'cover';
        this.domElement.style.backgroundPosition = 'center';
    }
}
