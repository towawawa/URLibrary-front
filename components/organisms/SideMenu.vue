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

setGenres();
</script>

<template>
  <div class="side-menu">
    <!-- ジャンル追加フォーム -->
    <div class="add-genre-section">
      <div class="add-genre-header">
        <button
          class="add-genre-btn"
          :class="{ active: showAddGenreForm }"
          @click="toggleAddGenreForm"
        >
          <i class="fas" :class="showAddGenreForm ? 'fa-times' : 'fa-plus'"></i>
          {{ showAddGenreForm ? 'キャンセル' : 'ジャンル追加' }}
        </button>
      </div>

      <!-- 展開可能なフォーム -->
      <Transition name="slide">
        <div v-if="showAddGenreForm" class="add-genre-form">
          <form @submit.prevent="handleSubmit">
            <div class="form-group">
              <label class="form-label">ジャンル名</label>
              <AtomsInput
                :value="genreForm.data.name"
                :error-message="genreForm.firstError('name')"
                placeholder="例: JavaScript, PHP..."
                @change="genreForm.update('name', $event)"
              />
            </div>

            <div class="form-actions">
              <AtomsBtn
                type="submit"
                variant="primary"
                size="sm"
                :disabled="isSubmitting"
                fullWidth
              >
                <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
                {{ isSubmitting ? '追加中...' : '追加' }}
              </AtomsBtn>
            </div>
          </form>
        </div>
      </Transition>
    </div>

    <!-- ジャンル一覧 -->
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

    <!-- AdSense広告スペース -->
    <div class="ad-space">
      <AtomsAdSense
        ad-slot="YOUR_AD_SLOT_ID"
        style="display: block; width: 280px; height: 280px"
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
  height: 100%;
  overflow-y: auto;
  padding: 1rem;
  position: sticky;
  top: 0;
}

.add-genre-section {
  margin-bottom: 1.5rem;
  border-bottom: 1px solid $border-light;
  padding-bottom: 1rem;

  .add-genre-header {
    margin-bottom: 0.75rem;

    .add-genre-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      width: 100%;
      padding: 0.75rem 1rem;
      background: $primary-light;
      color: $primary-dark;
      border: 1px solid $primary;
      border-radius: 8px;
      font-size: 0.85rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $primary;
        color: $white;
      }

      &.active {
        background: $error-light;
        color: $error;
        border-color: $error;

        &:hover {
          background: $error;
          color: $white;
        }
      }

      i {
        font-size: 0.8rem;
      }
    }
  }

  .add-genre-form {
    background: $gray-50;
    border-radius: 8px;
    padding: 1rem;

    .form-group {
      margin-bottom: 1rem;

      .form-label {
        display: block;
        font-size: 0.8rem;
        font-weight: 600;
        color: $text;
        margin-bottom: 0.5rem;
      }
    }

    .form-actions {
      margin-top: 1rem;
    }
  }
}

.genre-list {
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
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid $border-light;

  .ad-container {
    background: $gray-50;
    border: 2px dashed $border;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;

    .ad-placeholder {
      color: $text-muted;

      i {
        font-size: 2rem;
        margin-bottom: 0.75rem;
        display: block;
      }

      p {
        margin: 0 0 0.25rem 0;
        font-weight: 600;
        font-size: 0.9rem;
      }

      small {
        font-size: 0.75rem;
      }
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
