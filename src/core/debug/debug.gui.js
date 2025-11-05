import GUI from 'lil-gui';

export class DebugGUI {
    constructor(props, controls, context) {
        this.props = props;
        this.controls = controls;
        this.context = context;
    }

    init() {
        this.gui = new GUI({
            name: 'scene tree',
            closeOnTop: true,
            width: 100,
            title: 'Debug'
        });

        const el = this.gui.domElement;
        el.parentElement.style.zIndex = 99;
        el.style.zIndex = 10;
        el.style.top = 0;
        el.style.left = 0;
        el.style.float = 'left';

        // const displayStatus = el.style.display;
        // el.style.display = 'none';

        setTimeout(() => {
            el.querySelectorAll('.lil-name')
                .forEach((p) => p.setAttribute('style', 'width: 80%;'));
            el.querySelectorAll('.lil-widget')
                .forEach((p) => p.setAttribute('style', 'float: right;'));
            //     el.style.display = displayStatus;
        }, 0);

        // const root = this.gui.addFolder('Debug');
        // const { root } = this.gui;
        // root.title('Debug');

        // root.open();

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

    addCustomControl(name, handler, status = false) {
        this.props[name] = status;
        this.controls[name] = {
            action: () => { },
            toggle: (status) => handler(status),
        };
        const ctrl = this.gui.add(this.props, name);
        ctrl.onChange((value) => this.handler(name, value));
    }
}
