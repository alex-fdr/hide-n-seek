export function applyTransform(target, props = {}) {
    if (props.position) {
        const { x = 0, y = 0, z = 0 } = props.position;
        target.position.set(x, y, z);
    }

    if (props.rotation) {
        const { x = 0, y = 0, z = 0 } = props.rotation;
        target.rotation.set(x, y, z);
    }

    if (props.scale) {
        const { x = 1, y = 1, z = 1 } = props.scale;
        target.scale.set(x, y, z);
    }

    if (props.scaleFactor) {
        target.scale.multiplyScalar(props.scaleFactor);
    }
}
