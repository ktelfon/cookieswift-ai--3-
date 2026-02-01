import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [nodePolyfills()],
    esbuild: {
      jsx: 'automatic',
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          background: path.resolve(__dirname, 'background.ts'),
          content: path.resolve(__dirname, 'content.ts'),
        },
        output: {
          entryFileNames: '[name].js',
        },
      },
    }
  };
});
