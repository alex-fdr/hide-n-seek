import { Assets } from 'pixi.js';
import gamefont from '../assets/fonts/gamefont.woff';
import button from '../assets/images/button.png';
import dummyWhite from '../assets/images/dummy-white.png';
import infinitySign from '../assets/images/infinity-sign.png';
import pointer from '../assets/images/pointer.png';
import timerBg from '../assets/images/timer-bg.png';

export async function loadAssets() {
    await Assets.load({ alias: 'infinity-sign', src: infinitySign });
    await Assets.load({ alias: 'pointer', src: pointer });
    await Assets.load({ alias: 'dummy-white', src: dummyWhite });
    await Assets.load({ alias: 'button', src: button });
    await Assets.load({ alias: 'timer-bg', src: timerBg });
    await Assets.load({ alias: 'gamefont', src: gamefont });
}
