import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';
import { name } from './package.json';

export default defineConfig({
    base: `/${name}/`,
    build: {
        assetsInlineLimit: 40960000,
        outDir: './dist',
    },
    assetsInclude: ['**/*.glb', '**/*.gltf'],

    plugins: [viteSingleFile()],
});
