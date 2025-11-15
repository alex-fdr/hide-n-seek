import GUI from 'lil-gui';

export class DebugGUI {
    constructor(props, controls, context) {
        this.props = props;
        this.controls = controls;
        this.context = context;
    }

    init() {
        this.gui = new GUI({
            width: 100,
            title: 'Debug',
        });

        const el = this.gui.domElement;
        el.parentElement.style.zIndex = 99;
        el.style.zIndex = 10;
        el.style.top = 0;
        el.style.left = 0;
        el.style.float = 'left';

        setTimeout(() => {
            el.querySelectorAll('.lil-name').forEach((p) => {
                p.style.width = '80%';
            });
        }, 0);

        Object.keys(this.props).forEach((key) => {
            const ctrl = this.gui.add(this.props, key);
            ctrl.onChange((value) => this.handler(key, value));
        });
    }

    handler(name, value) {
        // if (this.controls[name]?.action) {
        this.props[name] = value;
        this.toggleControls(this.controls[name], value);
        // }
    }

    toggleControls(control, status) {
        if (control?.toggle) {
            control.toggle(status, this.context);
        }
    }

    addCustomToggle(label, initialValue = false, handler = () => {}) {
        this.props[label] = initialValue;
        this.controls[label] = {
            action: () => {},
            toggle: (status) => handler(status),
        };
        const ctrl = this.gui.add(this.props, label);
        ctrl.onChange((value) => this.handler(label, value));
    }
}
