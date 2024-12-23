import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import eslint from 'vite-plugin-eslint';

const emptyOutDir = false;
let format: 'module' | 'iife' = 'iife';
const input: {
  GUI?: string;
  options?: string;
  background?: string;
  content?: string;
} = {};

switch (process.env.BUILD_INPUT) {
  case 'html':
    format = 'module';
    input.GUI = resolve(__dirname, 'src/GUI.html');
    input.options = resolve(__dirname, 'src/options.html');
    break;
  case 'background':
    input.background = 'src/extension/background.ts';
    break;
  case 'content':
    input.content = 'src/extension/content.ts';
    break;
  default:
}

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  plugins: [react(), eslint()],
  publicDir: 'assets',
  build: {
    minify: 'terser',
    outDir: '../XSS',
    assetsDir: 'extension',
    emptyOutDir,
    rollupOptions: {
      input,
      output: {
        entryFileNames: 'extension/[name].js',
        assetFileNames: 'extension/[name].[ext]',
        format,
      },
    },
  },
  define: {
    global: {},
  },
  server: {
    open: '/GUI.html',
  },
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
      },
    },
  },
  envDir: __dirname,
});
