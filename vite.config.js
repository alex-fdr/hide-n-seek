import { defineConfig } from 'vite';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
    base: '/hide-n-seek/',
    build: {
        assetsInlineLimit: 40960000,
        outDir: './dist',
    },
    assetsInclude: ['**/*.glb', '**/*.gltf'],

    plugins: [viteSingleFile()],
});
