<script setup lang="ts">
const route = useRoute();
const showSideMenu = ref(false);
const { initAuth, isPublicPage } = useAuth();

// ルート変更時にサイドメニューを閉じる
watch(
  () => route.path,
  () => {
    showSideMenu.value = false;
  },
);

// サイドメニューの表示/非表示を切り替え
const toggleSideMenu = () => {
  showSideMenu.value = !showSideMenu.value;
};

// オーバーレイクリックでサイドメニューを閉じる
const closeSideMenu = () => {
  showSideMenu.value = false;
};

// ページ初期化時の認証チェック
await initAuth();
</script>

<template>
  <!-- ヘッダー -->
  <OrganismsHeader v-if="!isPublicPage" />

  <!-- メインコンテンツ -->
  <div class="app-layout" :class="{ 'app-layout--login': isPublicPage }">
    <!-- デスクトップサイドメニュー -->
    <aside v-if="!isPublicPage" class="sidebar desktop-sidebar">
      <OrganismsSideMenu />
    </aside>

    <!-- モバイルサイドメニューオーバーレイ -->
    <Transition name="overlay">
      <div
        v-if="showSideMenu && !isPublicPage"
        class="sidebar-overlay"
        @click="closeSideMenu"
      >
        <aside class="sidebar mobile-sidebar" @click.stop>
          <OrganismsSideMenu />
        </aside>
      </div>
    </Transition>

    <!-- メインコンテンツエリア -->
    <main class="main-content">
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>

  <!-- トーストコンテナ -->
  <OrganismsToastContainer />
</template>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  background: $background;

  &--login {
    justify-content: center;
    align-items: center;
    padding: 1rem;
  }

  .desktop-sidebar {
    display: block;
    flex-shrink: 0;
    border-right: 1px solid $border;
    border-bottom: 1px solid $border;
    background: $white;
    position: sticky;
    top: 0;
    height: 80vh;
    overflow-y: auto;
    z-index: 100;
  }

  .sidebar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    z-index: 1000;
    display: none;

    .mobile-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      height: 100vh;
      background: $white;
      box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
      overflow-y: auto;
      z-index: 1001;
    }
  }

  .main-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0; // Flexboxの幅計算を修正

    .content-wrapper {
      flex: 1;
      padding: 1.5rem;
      max-width: 100%;
      margin: 0 auto;
      width: 100%;
    }
  }
}

// Overlay transitions
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.3s ease;

  .mobile-sidebar {
    transition: transform 0.3s ease;
  }
}

.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;

  .mobile-sidebar {
    transform: translateX(-100%);
  }
}

// レスポンシブ対応
@media (max-width: 1024px) {
  .app-layout {
    .main-content .content-wrapper {
      padding: 1.25rem;
    }
  }
}

@media (max-width: 768px) {
  .app-layout {
    .desktop-sidebar {
      display: none;
    }

    .sidebar-overlay {
      display: block;
    }

    .main-content .content-wrapper {
      padding: 1rem;
    }
  }
}

@media (max-width: 480px) {
  .app-layout {
    &--login {
      padding: 0.75rem;
    }

    .main-content .content-wrapper {
      padding: 0.75rem;
    }
  }
}

// サイドメニューが280pxのため、メインコンテンツの最小幅を調整
@media (min-width: 769px) {
  .app-layout .main-content {
    min-width: calc(100vw - 280px);
  }
}
</style>
