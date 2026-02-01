import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                background: path.resolve(__dirname, 'background.ts'),
            },
            output: {
                entryFileNames: '[name].js',
            },
        },
    }
});
