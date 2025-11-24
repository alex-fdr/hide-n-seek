import { StickmanSkin } from './stickman-skin';
import { materials } from '../../systems/materials';

export class TigerSkin extends StickmanSkin {
    setupMaterials() {
        materials.replace(this.model, 'lambert', {}, true);
    }
}
