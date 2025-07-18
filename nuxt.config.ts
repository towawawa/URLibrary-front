// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,

  app: {
    head: {
      titleTemplate: 'URLibrary %s',
      title: 'URLibrary - URL管理・ブックマーク整理ツール',
      htmlAttrs: {
        lang: 'ja',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'URLibraryは効率的なURL管理とブックマーク整理ができるWebアプリケーションです。タグ機能、カレンダー表示、メモ機能でWebサイトを体系的に管理できます。',
        },
        {
          name: 'keywords',
          content:
            'URL管理,ブックマーク,Webサイト整理,タグ機能,カレンダー,メモ,URLibrary',
        },
        { name: 'author', content: 'URLibrary' },
        { name: 'robots', content: 'index, follow' },
        { name: 'googlebot', content: 'index, follow' },

        // OGP基本設定
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'URLibrary' },
        {
          property: 'og:title',
          content: 'URLibrary - URL管理・ブックマーク整理ツール',
        },
        {
          property: 'og:description',
          content:
            'URLibraryは効率的なURL管理とブックマーク整理ができるWebアプリケーションです。タグ機能、カレンダー表示、メモ機能でWebサイトを体系的に管理できます。',
        },
        { property: 'og:url', content: 'https://url-library.com' },
        {
          property: 'og:image',
          content: 'https://url-library.com/og-image.svg',
        },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:locale', content: 'ja_JP' },

        // Twitter Cards
        { name: 'twitter:card', content: 'summary_large_image' },
        {
          name: 'twitter:title',
          content: 'URLibrary - URL管理・ブックマーク整理ツール',
        },
        {
          name: 'twitter:description',
          content:
            'URLibraryは効率的なURL管理とブックマーク整理ができるWebアプリケーションです。タグ機能、カレンダー表示、メモ機能でWebサイトを体系的に管理できます。',
        },
        {
          name: 'twitter:image',
          content: 'https://url-library.com/og-image.svg',
        },

        // その他のSEO関連
        { name: 'theme-color', content: '#5a67d8' },
        { name: 'msapplication-TileColor', content: '#5a67d8' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
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

  // SEO・パフォーマンス最適化
  nitro: {
    compressPublicAssets: true,
    prerender: {
      crawlLinks: false,
      routes: ['/sitemap.xml', '/robots.txt'],
    },
  },

  css: ['@/assets/scss/style.scss'],
  modules: ['@nuxtjs/tailwindcss'],
  plugins: ['@/plugins/vue-select.ts', '@/plugins/highlight.ts'],

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
    // パフォーマンス最適化
    build: {
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['vue', 'vue-router'],
            utils: ['dayjs', 'lodash-es'],
          },
        },
      },
    },
  },

  runtimeConfig: {
    public: {
      apiBaseUrl:
        process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api',
      adsenseClientId: 'ca-pub-6623660361885724',
    },
  },
});
