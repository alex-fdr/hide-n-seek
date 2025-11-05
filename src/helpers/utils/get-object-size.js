import { Box3, Vector3 } from 'three';

export function getObjectSize(target) {
    const box = new Box3().setFromObject(target);
    const size = new Vector3();
    box.getSize(size);
    return size;
}
