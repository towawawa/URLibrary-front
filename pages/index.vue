<script lang="ts" setup>
import Index from '@/components/organisms/UrlLibrary/Index.vue';

// definePageMeta({
//   middleware: 'auth',
// });

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

    <!-- ゲストユーザー登録促進（ホーム用、控えめ表示） -->
    <div class="guest-prompt-home">
      <OrganismsGuestRegistrationPrompt />
    </div>

    <Index />
  </div>
</template>

<style lang="scss">
.guest-prompt-home {
  :deep(.guest-prompt) {
    background: rgba(90, 103, 216, 0.05);
    border: 1px solid rgba(90, 103, 216, 0.1);
    padding: 1rem 1.5rem;
    margin-bottom: 1rem;

    .guest-badge {
      background: rgba(90, 103, 216, 0.08);
    }

    .guest-message {
      font-size: 0.85rem;
    }

    .register-btn {
      font-size: 0.875rem;
      padding: 0.5rem 1rem;
    }
  }
}

// モバイルでは非表示
@media (max-width: 768px) {
  .guest-prompt-home {
    display: none;
  }
}
</style>
