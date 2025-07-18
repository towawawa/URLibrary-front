// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      titleTemplate: 'URLibrary',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },
  experimental: {
    typedPages: true,
  },

  css: [],
  modules: ['@nuxtjs/tailwindcss'],

  imports: {
    dirs: ['composables/**', 'store/**', 'components/**', 'types/**'],
  },

  compatibilityDate: '2024-10-27',

  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
    },
  },
});
