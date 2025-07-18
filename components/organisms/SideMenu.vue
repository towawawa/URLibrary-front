<script lang="ts" setup>
import type { Genre } from '@/types/api/genre';
import {
  initialData,
  validations,
  names,
  type Form,
} from '@/utils/forms/genre';

const genres = ref<Genre[]>([]);
const showAddGenreForm = ref(false);
const isSubmitting = ref(false);

// ジャンル追加フォーム
const genreForm = useForm(
  initialData,
  {
    name: ['required', 'max:255'],
  },
  names,
);

const setGenres = async () => {
  await fetcher('GET', '/genres')
    .then((res) => {
      genres.value = res.data as Genre[];
    })
    .catch((err) => {
      console.error(err);
    });
};

const deleteQueryGenreId = () => {
  const route = useRoute();

  // 現在のクエリからtagIdを消してそのままの画面にrouter.push
  const query = { ...route.query };
  delete query.genreId;

  useRouter().push(joinPathWithQuery(route.path, query));
};

const route = useRoute();
const pushQueryGenreId = (genreId: number) => {
  // 現在のクエリにtagIdを追加してそのままの画面にrouter.push
  useRouter().push(joinPathWithQuery(route.path, { ...route.query, genreId }));
};

const toggleAddGenreForm = () => {
  showAddGenreForm.value = !showAddGenreForm.value;
  if (!showAddGenreForm.value) {
    // フォームを閉じる時はリセット
    Object.assign(genreForm.data, initialData);
    genreForm.errors.value = {};
  }
};

const handleSubmit = async () => {
  if (genreForm.allValidate()) return; // バリデーションエラーがある場合は終了

  isSubmitting.value = true;

  try {
    await fetcher('POST', '/genres', { body: genreForm.data });
    await setGenres();
    toggleAddGenreForm();
  } catch (err: any) {
    if (err.status === 422) {
      genreForm.setErrors(err._data.errors);
    }
  } finally {
    isSubmitting.value = false;
  }
};

// コンポーネント初期化時にジャンルを取得
onMounted(() => {
  setGenres();
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
  <div class="side-menu">
    <div class="add-genre-container">
      <button class="add-genre-btn" @click="toggleAddGenreForm">
        <i class="fas fa-plus"></i>
        ジャンル追加
      </button>

      <Transition name="slide">
        <div v-if="showAddGenreForm" class="genre-form">
          <AtomsInput
            :value="genreForm.data.name"
            :error-message="genreForm.firstError('name')"
            placeholder="ジャンル名を入力"
            @change="genreForm.update('name', $event)"
          />
          <div class="form-actions">
            <AtomsBtn size="sm" :disabled="isSubmitting" @click="handleSubmit">
              {{ isSubmitting ? '追加中...' : '追加' }}
            </AtomsBtn>
            <AtomsBtn size="sm" variant="outline" @click="toggleAddGenreForm">
              キャンセル
            </AtomsBtn>
          </div>
        </div>
      </Transition>
    </div>

    <div class="genre-list">
      <ul>
        <li
          class="genre-item all-genre"
          :class="{ selected: !route.query.genreId }"
          @click="deleteQueryGenreId()"
        >
          <div class="genre-icon">
            <i class="fas fa-list"></i>
          </div>
          <span class="genre-name">すべて</span>
          <div class="genre-count">{{ genres.length }}</div>
        </li>

        <li
          v-for="genre in genres"
          :key="genre.id"
          class="genre-item"
          :class="{ selected: Number(route.query.genreId) === genre.id }"
          @click="pushQueryGenreId(genre.id)"
        >
          <div class="genre-icon">
            <i :class="getDefaultIcon(genre.name)"></i>
          </div>
          <span class="genre-name">{{ genre.name }}</span>
        </li>
      </ul>
    </div>

    <!-- サイドバー下部の広告スペース -->
    <div class="ad-space">
      <AtomsAdSense
        ad-slot="2163232479"
        ad-format="auto"
        style="display: block; width: 250px; margin: 0 auto"
        class="sidebar-ad"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.side-menu {
  width: 280px;
  background: $white;
  border-right: 1px solid $border;
  min-height: 100%; /* heightからmin-heightに変更 */
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
}

.add-genre-container {
  margin-bottom: 1rem;

  .add-genre-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    padding: 0.75rem;
    background: $primary-light;
    color: $primary;
    border: 1px solid $primary-light;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $primary;
      color: $white;
    }

    i {
      font-size: 0.8rem;
    }
  }

  .genre-form {
    padding: 1rem;
    background: $gray-50;
    border: 1px solid $border-light;
    border-radius: 6px;
    margin-top: 0.5rem;

    .form-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 0.75rem;
    }
  }
}

.genre-list {
  flex: 1; /* フレックス成長を追加 */
  overflow-y: auto; /* ジャンルリストのスクロール */

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .genre-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 0.25rem;

    &:hover {
      background: $gray-100;
    }

    &.selected {
      background: $primary-light;
      color: $primary-dark;

      .genre-icon i {
        color: $primary;
      }
    }

    &.all-genre {
      font-weight: 600;
      border-bottom: 1px solid $border-light;
      margin-bottom: 0.75rem;
      padding-bottom: 1rem;

      .genre-count {
        margin-left: auto;
        background: $gray-200;
        color: $text-muted;
        font-size: 0.7rem;
        padding: 0.25rem 0.5rem;
        border-radius: 12px;
        min-width: 1.5rem;
        text-align: center;
      }

      &.selected .genre-count {
        background: $primary;
        color: $white;
      }
    }

    .genre-icon {
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      color: $text-muted;
      flex-shrink: 0;

      i {
        font-size: 1rem;
      }
    }

    .genre-name {
      font-size: 0.85rem;
      font-weight: 500;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.ad-space {
  margin-top: 1rem;
  padding: 0.75rem;
  background: $gray-50;
  border-radius: 6px;
  border: 1px solid $border-light;
  text-align: center;
  max-height: 220px !important; /* 下部広告の高さ制限 */
  overflow: hidden !important;

  .sidebar-ad {
    max-width: 100%;
    height: 200px !important;
    max-height: 200px !important;

    .adsbygoogle {
      height: 200px !important;
      max-height: 200px !important;
      width: 100% !important;
      max-width: 250px !important;
    }

    iframe {
      height: 200px !important;
      max-height: 200px !important;
      width: 100% !important;
      max-width: 250px !important;
    }
  }
}

// スライドトランジション
.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.slide-enter-from,
.slide-leave-to {
  max-height: 0;
  opacity: 0;
  padding-top: 0;
  padding-bottom: 0;
}

// レスポンシブ対応
@media (max-width: 1024px) {
  .side-menu {
    width: 240px;
    padding: 0.75rem;

    .genre-list .genre-item {
      padding: 0.625rem 0.75rem;

      .genre-name {
        font-size: 0.8rem;
      }
    }
  }
}

@media (max-width: 768px) {
  .side-menu {
    position: fixed;
    left: -280px;
    top: 0;
    width: 280px;
    height: 100vh;
    z-index: 1000;
    box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
    transition: left 0.3s ease;

    &.open {
      left: 0;
    }
  }
}
</style>
