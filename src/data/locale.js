import { default as en } from '../assets/settings/en';

const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
const localeId = urlParams.get('loc') ?? 'en';

const languages = {
    en,
};

export const locale = languages[localeId];
