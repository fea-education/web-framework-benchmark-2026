import { defineConfig } from 'vite';
import { qwikVite } from '@builder.io/qwik/optimizer';
import { qwikCity } from '@builder.io/qwik-city/vite';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig(() => ({
  plugins: [
    qwikCity(),
    qwikVite(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '~': resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 3007,
  },
  preview: {
    port: 3007,
  },
}));
