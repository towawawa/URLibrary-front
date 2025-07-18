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
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        {
          rel: 'stylesheet',
          href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css',
        },
      ],
      script: [
        {
          async: true,
          src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6623660361885724',
          crossorigin: 'anonymous',
        },
      ],
    },
  },

  experimental: {
    typedPages: true,
  },

  css: ['@/assets/scss/style.scss'],
  modules: ['@nuxtjs/tailwindcss'],
  plugins: ['@/plugins/vue-select.ts'],

  imports: {
    dirs: ['composables/**', 'store/**', 'components/**', 'types/**'],
  },

  compatibilityDate: '2024-10-27',

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/scss/_colors.scss" as *;',
        },
      },
    },
    // 開発モードでのverboseなログを無効化
    logLevel: 'warn',
  },

  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
      adsenseClientId: 'ca-pub-6623660361885724',
    },
  },
});
