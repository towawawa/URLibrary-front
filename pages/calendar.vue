<script lang="ts" setup>
import Index from '@/components/organisms/Calendar/Index.vue';

definePageMeta({
  middleware: 'auth',
});

// SEO設定
useHead({
  title: 'カレンダー',
  meta: [
    {
      name: 'description',
      content:
        'URLibraryのカレンダー表示機能で、保存したURLを日付ごとに可視化して管理できます。月間ビューで効率的にWebサイトの保存履歴を確認しましょう。',
    },
    {
      name: 'keywords',
      content: 'カレンダー表示,URL履歴,日付管理,月間ビュー,ブックマーク履歴',
    },
    {
      property: 'og:title',
      content: 'URLibrary - カレンダー',
    },
    {
      property: 'og:description',
      content:
        'URLibraryのカレンダー表示機能で、保存したURLを日付ごとに可視化して管理できます。月間ビューで効率的にWebサイトの保存履歴を確認しましょう。',
    },
  ],
});
</script>

<template>
  <div class="calendar-content">
    <Index />
  </div>
</template>

<style lang="scss">
.calendar-content {
  margin: 20px;
}
</style>
