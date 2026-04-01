import tailwindcss from '@tailwindcss/vite'

// @ts-ignore – @tailwindcss/vite ships Vite 7 types; Nuxt uses Vite 6 internally. Safe at runtime.
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: true,
  modules: ['@nuxt/image', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  vite: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    plugins: [tailwindcss() as any],
  },
  runtimeConfig: {
    public: {
      apiUrl: process.env['API_URL'] ?? 'http://localhost:3000',
    },
  },
  image: {
    domains: ['picsum.photos'],
    provider: 'none',
  },
  nitro: {
    preset: 'node-server',
    prerender: {
      crawlLinks: false,
    },
  },
})
