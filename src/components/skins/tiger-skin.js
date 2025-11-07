import { materials } from '../../helpers/materials';
import { StickmanSkin } from './stickman-skin';

export class TigerSkin extends StickmanSkin {
    setupMaterials() {
        materials.replace(this.model, 'lambert', { emissive: 0x222222 }, true);
    }
}
