import { default as en } from '../assets/settings/l10n';

const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
const localeId = urlParams.get('loc') ?? 'en';

const parseLocaleData = (data) => {
    const keys = Object.keys(data);
    const output = {};

    for (const key of keys) {
        const str = data[key];
        const [text, fontSize] = str.split('^');
        output[key] = {
            text,
            fontSize: `${fontSize}px`,
        };
    }

    return output;
};

const languages = {
    en: parseLocaleData(en),
};

export const locale = languages[localeId];
