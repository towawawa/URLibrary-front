// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      titleTemplate: 'URLibrary %s',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [{ rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }],
    },
  },
  experimental: {
    typedPages: true,
  },

  css: ['@/assets/scss/style.scss'],
  modules: ['@nuxtjs/tailwindcss'],

  imports: {
    dirs: ['composables/**', 'store/**', 'components/**', 'types/**'],
  },

  compatibilityDate: '2024-10-27',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@use "~/assets/scss/_colors.scss" as *;',
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl: 'http://localhost:8080/api',
    },
  },
});
