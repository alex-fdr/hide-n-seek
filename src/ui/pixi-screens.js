export class PixiScreens {
    constructor(stage) {
        this.stage = stage;
        this.containers = {};
    }

    add(name, screen) {
        this.containers[name] = screen;
        this.stage.addChild(screen.group);
    }

    show(name) {
        this.containers[name]?.show();
    }

    hide(name) {
        this.containers[name]?.hide();
    }

    handlePortrait(cx, cy) {
        Object.keys(this.containers).forEach((key) => {
            this.containers[key]?.handlePortrait(cx, cy);
        });
    }

    handleLandscape(cx, cy, scaleFactor) {
        Object.keys(this.containers).forEach((key) => {
            this.containers[key]?.handleLandscape(cx, cy, scaleFactor);
        });
    }
}
