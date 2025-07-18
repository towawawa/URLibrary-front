<script lang="ts" setup>
import type { Genre } from '@/types/api/genre';

const searchForm = useForm(
  { keyword: '' },
  { keyword: ['max:255'] },
  { keyword: '検索ワード' },
);

const showRegisterUrlPopup = ref(false);
const showUserMenu = ref(false);
const showGenreMenu = ref(false);

// 認証情報を取得
const { user, logout: authLogout } = useAuth();

const logout = async () => {
  await authLogout();
};

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value;
  // 他のメニューを閉じる
  showGenreMenu.value = false;
};

const toggleGenreMenu = () => {
  showGenreMenu.value = !showGenreMenu.value;
  // 他のメニューを閉じる
  showUserMenu.value = false;
};

// ユーザーメニューを閉じる
const closeUserMenu = () => {
  showUserMenu.value = false;
};

// ジャンルメニューを閉じる
const closeGenreMenu = () => {
  showGenreMenu.value = false;
};

// 外部クリックでメニューを閉じる
const closeMenusOnOutsideClick = () => {
  showUserMenu.value = false;
  showGenreMenu.value = false;
};

// ジャンル選択時の処理
const selectGenre = (genreId?: number) => {
  const route = useRoute();
  if (genreId) {
    useRouter().push(
      joinPathWithQuery(route.path, { ...route.query, genreId }),
    );
  } else {
    // 全て表示の場合
    const query = { ...route.query };
    delete query.genreId;
    useRouter().push(joinPathWithQuery(route.path, query));
  }
  closeGenreMenu();
};

// ジャンル一覧を取得
const genres = ref<Genre[]>([]);
const fetchGenres = async () => {
  try {
    const res = await fetcher('GET', '/genres');
    genres.value = res.data as Genre[];
  } catch (err) {
    console.error('ジャンル取得エラー:', err);
  }
};

onMounted(() => {
  fetchGenres();
});

// ジャンル名に基づいてデフォルトアイコンを取得
const getDefaultIcon = (genreName: string) => {
  const defaultIcons: Record<string, string> = {
    JavaScript: 'fab fa-js-square',
    PHP: 'fab fa-php',
    React: 'fab fa-react',
    Vue: 'fab fa-vuejs',
    Angular: 'fab fa-angular',
    'Node.js': 'fab fa-node-js',
    Python: 'fab fa-python',
    Java: 'fab fa-java',
    HTML: 'fab fa-html5',
    CSS: 'fab fa-css3-alt',
    SCSS: 'fab fa-sass',
    TypeScript: 'fab fa-js-square',
    Laravel: 'fab fa-laravel',
    Symfony: 'fab fa-symfony',
    WordPress: 'fab fa-wordpress',
    Git: 'fab fa-git-alt',
    GitHub: 'fab fa-github',
    Docker: 'fab fa-docker',
    AWS: 'fab fa-aws',
    Database: 'fas fa-database',
    API: 'fas fa-cogs',
    デザイン: 'fas fa-palette',
    'UI/UX': 'fas fa-drafting-compass',
    その他: 'fas fa-folder',
  };

  return defaultIcons[genreName] || 'fas fa-folder';
};
</script>

<template>
  <OrganismsUrlLibraryPopupRegister
    v-if="showRegisterUrlPopup"
    @close="showRegisterUrlPopup = false"
  />

  <!-- メニューを閉じるためのオーバーレイ -->
  <div
    v-if="showUserMenu || showGenreMenu"
    class="menu-overlay"
    @click="closeMenusOnOutsideClick"
  ></div>

  <header class="header">
    <!-- Main header -->
    <div class="header-main">
      <div class="header-left">
        <nuxt-link class="logo" to="/" @click="closeMenusOnOutsideClick">
          URLibrary
        </nuxt-link>
      </div>

      <!-- Desktop search -->
      <div class="search-container desktop-only">
        <div class="search-input">
          <i class="fas fa-search search-icon"></i>
          <AtomsInput
            class="search-field"
            :value="searchForm.data.keyword"
            :error-message="searchForm.firstError('keyword')"
            placeholder="タイトルで検索..."
            size="lg"
            @change="searchForm.update('keyword', $event)"
            @keyup.enter="searchForm.pushWithQuery('/')"
          />
          <button
            v-if="searchForm.data.keyword"
            @click="
              searchForm.update('keyword', '');
              searchForm.pushWithQuery('/');
            "
            class="clear-btn"
            type="button"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div class="header-right">
        <!-- Desktop menu -->
        <div class="desktop-menu">
          <AtomsBtn
            class="add-url-btn"
            size="md"
            @click="showRegisterUrlPopup = true"
          >
            <i class="fas fa-plus"></i>
            URL追加
          </AtomsBtn>

          <!-- Desktop user menu dropdown -->
          <div class="user-menu-dropdown">
            <button
              class="user-menu-trigger"
              @click="toggleUserMenu"
              :class="{ active: showUserMenu }"
            >
              <i class="fas fa-user"></i>
              <span>{{ user?.name || 'ユーザー' }}</span>
              <i
                class="fas fa-chevron-down dropdown-icon"
                :class="{ rotated: showUserMenu }"
              ></i>
            </button>

            <!-- Dropdown menu -->
            <Transition name="dropdown">
              <div v-if="showUserMenu" class="user-dropdown-menu">
                <nuxt-link
                  to="/profile"
                  class="dropdown-item"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-user-cog"></i>
                  設定
                </nuxt-link>
                <button
                  class="dropdown-item logout-item"
                  @click="
                    logout();
                    closeUserMenu();
                  "
                >
                  <i class="fas fa-sign-out-alt"></i>
                  ログアウト
                </button>
              </div>
            </Transition>
          </div>
        </div>

        <!-- Mobile menu -->
        <div class="mobile-menu">
          <!-- Genre filter button -->
          <div class="genre-menu-dropdown mobile-only">
            <button
              class="genre-menu-trigger"
              @click="toggleGenreMenu"
              :class="{ active: showGenreMenu }"
            >
              <i class="fas fa-folder"></i>
            </button>

            <!-- Genre dropdown menu -->
            <Transition name="dropdown">
              <div v-if="showGenreMenu" class="genre-dropdown-menu">
                <button class="dropdown-item" @click="selectGenre()">
                  <i class="fas fa-list"></i>
                  すべて
                </button>
                <button
                  v-for="genre in genres"
                  :key="genre.id"
                  class="dropdown-item"
                  @click="selectGenre(genre.id)"
                >
                  <i :class="getDefaultIcon(genre.name)"></i>
                  {{ genre.name }}
                </button>
              </div>
            </Transition>
          </div>

          <!-- Mobile user menu dropdown -->
          <div class="user-menu-dropdown mobile-only">
            <button
              class="user-menu-trigger mobile-user-trigger"
              @click="toggleUserMenu"
              :class="{ active: showUserMenu }"
            >
              <i class="fas fa-user"></i>
            </button>

            <!-- Dropdown menu -->
            <Transition name="dropdown">
              <div
                v-if="showUserMenu"
                class="user-dropdown-menu mobile-user-dropdown"
              >
                <button
                  class="dropdown-item add-url-item"
                  @click="
                    showRegisterUrlPopup = true;
                    closeUserMenu();
                  "
                >
                  <i class="fas fa-plus"></i>
                  URL追加
                </button>
                <nuxt-link
                  to="/profile"
                  class="dropdown-item"
                  @click="closeUserMenu"
                >
                  <i class="fas fa-user-cog"></i>
                  設定
                </nuxt-link>
                <button
                  class="dropdown-item logout-item"
                  @click="
                    logout();
                    closeUserMenu();
                  "
                >
                  <i class="fas fa-sign-out-alt"></i>
                  ログアウト
                </button>
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation - 常に表示 -->
    <nav class="nav-section">
      <ul class="nav-list">
        <li>
          <nuxt-link to="/" class="nav-link">
            <i class="fas fa-home"></i>
            <span>ホーム</span>
          </nuxt-link>
        </li>
        <li>
          <nuxt-link to="/calendar" class="nav-link">
            <i class="fas fa-calendar-alt"></i>
            <span>カレンダー</span>
          </nuxt-link>
        </li>
      </ul>
    </nav>
  </header>
</template>

<style lang="scss" scoped>
.menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 999;
  background: transparent;
}

.header {
  background-color: $white;
  border-bottom: 1px solid $border;
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
}

.header-main {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem 0.75rem calc(1.5rem + 30px); /* 左側にサイドメニューの幅分を追加 */
  width: 100%;
}

.header-left {
  .logo {
    font-size: 2rem;
    font-weight: 700;
    color: $primary;
    text-decoration: none;

    &:hover {
      color: $primary-hover;
    }
  }
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 2rem;

  .search-input {
    position: relative;
    display: flex;
    align-items: center;
    background: $white;
    border: 2px solid $border-light;
    border-radius: 12px;
    overflow: hidden;
    transition: all 0.2s ease;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);

    &:hover {
      border-color: $primary-light;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    }

    &:focus-within {
      border-color: $primary;
      box-shadow: 0 0 0 3px rgba(116, 160, 67, 0.15);
    }

    .search-icon {
      position: absolute;
      left: 1rem;
      color: $text-muted;
      font-size: 1rem;
      z-index: 2;
      transition: color 0.2s ease;
    }

    &:focus-within .search-icon {
      color: $primary;
    }

    .clear-btn {
      position: absolute;
      right: 0.5rem;
      background: none;
      border: none;
      color: $text-muted;
      cursor: pointer;
      font-size: 0.9rem;
      padding: 0.5rem;
      border-radius: 50%;
      z-index: 2;
      transition: all 0.2s ease;

      &:hover {
        background: $gray-100;
        color: $error;
      }
    }

    .search-field {
      flex: 1;
      border: none;
      background: transparent;
      outline: none;
      padding: 0.75rem 3rem; /* Left padding for icon, right for clear button */
      font-size: 0.9rem;

      &::placeholder {
        color: $text-muted;
      }

      &:focus {
        border: none;
        box-shadow: none;
      }
    }
  }
}

.header-right {
  display: flex;
  align-items: center;
  margin-left: auto;
}

.desktop-menu {
  display: flex;
  align-items: center;
  gap: 1rem;

  .add-url-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: $primary;
    color: $white;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;

    &:hover {
      background: $primary-hover;
    }

    i {
      font-size: 0.8rem;
    }
  }
}

.user-menu-dropdown {
  position: relative;

  .user-menu-trigger {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: $gray-100;
    color: $text;
    border: none;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    .dropdown-icon {
      font-size: 0.7rem;
      transition: transform 0.2s ease;

      &.rotated {
        transform: rotate(180deg);
      }
    }

    &:hover,
    &.active {
      background: $gray-200;
    }

    &.mobile-user-trigger {
      padding: 0.5rem;
      width: 2.5rem;
      height: 2.5rem;
      justify-content: center;

      span {
        display: none;
      }

      .dropdown-icon {
        display: none;
      }
    }
  }

  .user-dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: $white;
    border: 1px solid $border;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 180px;
    z-index: 1001;
    overflow: hidden;

    &.mobile-user-dropdown {
      min-width: 160px;
    }

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      text-align: left;
      color: $text;
      text-decoration: none;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      i {
        font-size: 0.8rem;
        width: 1rem;
      }

      &:hover {
        background: $gray-100;
      }

      &.add-url-item {
        color: $primary;

        &:hover {
          background: $primary-light;
        }
      }

      &.logout-item {
        color: $error;
        border-top: 1px solid $border;

        &:hover {
          background: $error-light;
        }
      }
    }
  }
}

.genre-menu-dropdown {
  position: relative;
  margin-right: 0.5rem;

  .genre-menu-trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2.5rem;
    height: 2.5rem;
    background: $gray-100;
    color: $text;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover,
    &.active {
      background: $primary-light;
      color: $primary;
    }

    i {
      font-size: 1rem;
    }
  }

  .genre-dropdown-menu {
    position: absolute;
    top: calc(100% + 0.5rem);
    right: 0;
    background: $white;
    border: 1px solid $border;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    min-width: 180px;
    max-height: 300px;
    overflow-y: auto;
    z-index: 1001;

    .dropdown-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: none;
      border: none;
      text-align: left;
      color: $text;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      i {
        font-size: 0.8rem;
        width: 1rem;
      }

      &:hover {
        background: $gray-100;
      }

      &:first-child {
        border-bottom: 1px solid $border;
        color: $primary;

        &:hover {
          background: $primary-light;
        }
      }
    }
  }
}

.mobile-menu {
  display: none;
  align-items: center;
  gap: 0.75rem;
}

.nav-section {
  border-top: 1px solid $border;
  background: $gray-50;

  .nav-list {
    display: flex;
    padding: 0 1.5rem; // 左右の余白を統一
    list-style: none;
    margin: 0;

    li {
      .nav-link {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.75rem 1rem;
        color: $text;
        text-decoration: none;
        font-size: 0.9rem;
        font-weight: 500;
        border-radius: 6px;
        transition: all 0.2s ease;

        i {
          font-size: 0.9rem;
        }

        &:hover {
          background: $white;
          color: $primary;
        }

        &.router-link-active {
          background: $primary;
          color: $white;
        }
      }
    }
  }
}

// Dropdown transition
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 0.2s ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

// Responsive utilities
.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: flex;
  }

  .desktop-menu {
    display: none;
  }

  .mobile-menu {
    display: flex;
  }

  .header-main {
    padding: 0.75rem 1rem; // モバイルでは余白を少し小さく
  }

  .nav-section .nav-list {
    padding: 0 1rem;

    li .nav-link {
      padding: 0.5rem 0.75rem;
      font-size: 0.85rem;

      span {
        display: none; // モバイルではアイコンのみ
      }
    }
  }
}

@media (max-width: 480px) {
  .header-main {
    padding: 0.5rem 0.75rem;
  }

  .header-left .logo {
    font-size: 1.25rem;
  }

  .mobile-menu .mobile-search {
    max-width: 150px;
  }

  .nav-section .nav-list {
    padding: 0 0.75rem;
  }
}
</style>
