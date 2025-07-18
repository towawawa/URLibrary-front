<script lang="ts" setup>
import Index from '@/components/organisms/UrlLibrary/Index.vue';

definePageMeta({
  middleware: 'auth',
});

// SEO設定
useHead({
  title: 'ホーム',
  meta: [
    {
      name: 'description',
      content:
        'URLibraryでURL管理とブックマーク整理を効率的に行いましょう。保存したWebサイトをタグやジャンルで分類し、カレンダー表示やメモ機能で体系的に管理できます。',
    },
    {
      name: 'keywords',
      content: 'URL管理,ブックマーク整理,Webサイト管理,タグ分類,ジャンル整理',
    },
    {
      property: 'og:title',
      content: 'URLibrary - ホーム',
    },
    {
      property: 'og:description',
      content:
        'URLibraryでURL管理とブックマーク整理を効率的に行いましょう。保存したWebサイトをタグやジャンルで分類し、カレンダー表示やメモ機能で体系的に管理できます。',
    },
  ],
});
</script>

<template>
  <div class="top-content">
    <!-- 構造化データ -->
    <SEOStructuredData type="website" />

    <Index />
  </div>
</template>

<style lang="scss"></style>
