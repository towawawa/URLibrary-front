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
    image: ['max:5120'],
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

const submitGenre = async () => {
  if (genreForm.allValidate()) return;

  isSubmitting.value = true;

  try {
    const formData = new FormData();
    formData.append('name', genreForm.data.name);
    if (genreForm.data.image) {
      formData.append('image', genreForm.data.image);
    }

    await fetcher('POST', '/genres', {
      body: formData,
    });

    // 成功時はジャンル一覧を再取得してフォームを閉じる
    await setGenres();
    Object.assign(genreForm.data, initialData);
    genreForm.errors.value = {};
    showAddGenreForm.value = false;
  } catch (err: any) {
    if (err.status === 422) {
      genreForm.setErrors(err._data.errors);
    } else {
      console.error('ジャンルの追加に失敗しました:', err);
    }
  } finally {
    isSubmitting.value = false;
  }
};

const handleImageChange = (file: File | null) => {
  genreForm.update('image', file);
};

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement;
  const nextIcon = target.nextElementSibling as HTMLElement;
  if (target && nextIcon) {
    target.style.display = 'none';
    nextIcon.style.display = 'flex';
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
    TypeScript: 'fab fa-js-square', // TypeScript用のアイコンがないのでJSで代用
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

await setGenres();
</script>

<template>
  <div class="side-menu">
    <div class="genre-section">
      <div class="genre-header">
        <h3>
          <i class="fas fa-folder-open"></i>
          ジャンル
        </h3>
        <button
          class="add-genre-btn"
          :class="{ active: showAddGenreForm }"
          @click="toggleAddGenreForm"
        >
          <i class="fas" :class="showAddGenreForm ? 'fa-times' : 'fa-plus'"></i>
        </button>
      </div>

      <!-- ジャンル追加フォーム -->
      <div v-if="showAddGenreForm" class="add-genre-form">
        <div class="form-group">
          <label>ジャンル名</label>
          <AtomsInput
            :value="genreForm.data.name"
            :error-message="genreForm.firstError('name')"
            placeholder="ジャンル名を入力"
            @change="genreForm.update('name', $event)"
          />
        </div>

        <div class="form-group">
          <label>アイコン画像（任意）</label>
          <AtomsFileInput
            accept="image/*"
            :error-message="genreForm.firstError('image')"
            @change="handleImageChange"
          />
          <p class="file-note">
            未設定の場合はデフォルトアイコンが表示されます
          </p>
        </div>

        <div class="form-actions">
          <button
            class="cancel-btn"
            @click="toggleAddGenreForm"
            :disabled="isSubmitting"
          >
            キャンセル
          </button>
          <button
            class="submit-btn"
            @click="submitGenre"
            :disabled="isSubmitting || !genreForm.data.name.trim()"
          >
            <i v-if="isSubmitting" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-plus"></i>
            {{ isSubmitting ? '追加中...' : '追加' }}
          </button>
        </div>
      </div>
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
            <img
              v-if="genre.imagePath"
              :src="genre.imagePath"
              :alt="genre.name"
              @error="handleImageError"
            />
            <i v-else :class="getDefaultIcon(genre.name)"></i>
          </div>
          <span class="genre-name">{{ genre.name }}</span>
        </li>
      </ul>
    </div>

    <!-- 広告スペース -->
    <div class="ad-space">
      <div class="ad-container">
        <div class="ad-placeholder">
          <i class="fas fa-bullhorn"></i>
          <p>広告スペース</p>
          <small>ここに広告が表示されます</small>
        </div>
        <!-- 実際の広告コードはここに配置 -->
        <!-- 例: Google AdSense, Amazon アソシエイト など -->
      </div>
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

.genre-section {
  .genre-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    padding: 0.75rem;
    background: $gray-50;
    border-radius: 8px;

    h3 {
      font-size: 1rem;
      font-weight: 600;
      color: $text;
      margin: 0;
      display: flex;
      align-items: center;
      gap: 0.5rem;

      i {
        color: $primary;
        font-size: 0.9rem;
      }
    }

    .add-genre-btn {
      background: $primary;
      color: $white;
      border: none;
      border-radius: 50%;
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      transition: all 0.2s ease;
      font-size: 0.8rem;

      &:hover {
        background: $primary-hover;
        transform: scale(1.1);
      }

      &.active {
        background: $error;

        &:hover {
          background: darken($error, 10%);
        }
      }
    }
  }

  .add-genre-form {
    background: $gray-50;
    border: 1px solid $border;
    border-radius: 8px;
    padding: 1rem;
    margin-bottom: 1rem;
    animation: slideDown 0.3s ease;

    .form-group {
      margin-bottom: 1rem;

      label {
        display: block;
        font-size: 0.85rem;
        font-weight: 500;
        color: $text;
        margin-bottom: 0.5rem;
      }

      .file-note {
        font-size: 0.75rem;
        color: $text-muted;
        margin-top: 0.25rem;
        margin-bottom: 0;
      }
    }

    .form-actions {
      display: flex;
      gap: 0.5rem;
      margin-top: 1rem;

      button {
        flex: 1;
        padding: 0.5rem;
        border: none;
        border-radius: 6px;
        font-size: 0.8rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.375rem;

        &:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
      }

      .cancel-btn {
        background: $gray-200;
        color: $text;

        &:hover:not(:disabled) {
          background: $gray-300;
        }
      }

      .submit-btn {
        background: $primary;
        color: $white;

        &:hover:not(:disabled) {
          background: $primary-hover;
        }

        .fa-spinner {
          animation: spin 1s linear infinite;
        }
      }
    }
  }
}

.genre-list {
  margin-bottom: 2rem;

  ul {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  .genre-item {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    margin-bottom: 0.25rem;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;

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
      border: 1px solid $border;
      margin-bottom: 1rem;
      font-weight: 500;

      .genre-icon {
        background: $primary-light;

        i {
          color: $primary;
        }
      }

      .genre-count {
        background: $primary;
        color: $white;
        font-size: 0.7rem;
        padding: 0.125rem 0.375rem;
        border-radius: 12px;
        font-weight: 600;
        margin-left: auto;
      }
    }

    .genre-icon {
      width: 32px;
      height: 32px;
      margin-right: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
      background: $gray-100;
      flex-shrink: 0;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        border-radius: 6px;
      }

      i {
        font-size: 0.9rem;
        color: $text-muted;
      }
    }

    .genre-name {
      font-size: 0.9rem;
      font-weight: 500;
      color: $text;
      flex: 1;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

.ad-space {
  border-top: 1px solid $border;
  padding-top: 1rem;
  margin-top: auto;

  .ad-container {
    .ad-placeholder {
      background: linear-gradient(135deg, $gray-50 0%, $gray-100 100%);
      border: 2px dashed $border;
      border-radius: 8px;
      padding: 1.5rem 1rem;
      text-align: center;
      color: $text-muted;
      min-height: 200px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      i {
        font-size: 2rem;
        margin-bottom: 0.5rem;
        opacity: 0.6;
      }

      p {
        font-size: 0.9rem;
        font-weight: 500;
        margin: 0;
      }

      small {
        font-size: 0.75rem;
        opacity: 0.8;
      }
    }

    /* 実際の広告が表示される場合のスタイル */
    .ad-content {
      border-radius: 8px;
      overflow: hidden;

      img {
        width: 100%;
        height: auto;
        display: block;
      }

      /* Google AdSense等のiframe対応 */
      iframe {
        width: 100%;
        max-width: 100%;
        border: none;
        border-radius: 8px;
      }

      /* テキスト広告の場合 */
      .text-ad {
        background: $white;
        border: 1px solid $border;
        border-radius: 8px;
        padding: 1rem;

        .ad-title {
          font-size: 0.9rem;
          font-weight: 600;
          color: $text;
          margin-bottom: 0.5rem;
        }

        .ad-description {
          font-size: 0.8rem;
          color: $text-muted;
          line-height: 1.4;
        }

        .ad-link {
          color: $primary;
          text-decoration: none;
          font-size: 0.8rem;

          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

// Responsive
@media (max-width: 768px) {
  .side-menu {
    width: 100%;
    height: auto;
    position: static;
    border-right: none;
    border-bottom: 1px solid $border;

    .ad-space {
      margin-top: 1rem;

      .ad-container .ad-placeholder {
        min-height: 150px;
        padding: 1rem 0.75rem;

        i {
          font-size: 1.5rem;
        }

        p {
          font-size: 0.85rem;
        }

        small {
          font-size: 0.7rem;
        }
      }
    }
  }
}
</style>
