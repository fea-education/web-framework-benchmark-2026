import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'path'

export default defineConfig({
  plugins: [tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        listing: resolve(__dirname, 'listing.html'),
        detail: resolve(__dirname, 'detail.html'),
        filter: resolve(__dirname, 'filter.html'),
        cart: resolve(__dirname, 'cart.html'),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
})
