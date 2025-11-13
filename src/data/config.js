import { default as config1 } from '../assets/settings/config1';

const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
const configId = urlParams.get('config') ?? '1';

const configs = {
    1: config1,
};

export const config = configs[configId];
