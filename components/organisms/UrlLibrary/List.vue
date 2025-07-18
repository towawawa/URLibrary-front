<script lang="ts" setup>
import type { UrlLibrary } from '@/types/api/urlLibrary';

type Props = {
  class?: string;
  data: UrlLibrary[];
  loading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  loading: false,
});

const emits = defineEmits<{
  (event: 'click-note', value: number): void;
  (event: 'click-edit', value: number): void;
  (event: 'click-delete', value: number): void;
  (event: 'add-url'): void;
}>();
</script>

<template>
  <div class="url-library-list" :class="props.class">
    <!-- ローディング状態 -->
    <div v-if="loading" class="loading-state">
      <div class="loading-card" v-for="i in 3" :key="i">
        <div class="loading-header">
          <div class="loading-skeleton loading-domain"></div>
          <div class="loading-actions">
            <div
              class="loading-skeleton loading-btn"
              v-for="j in 3"
              :key="j"
            ></div>
          </div>
        </div>
        <div class="loading-content">
          <div class="loading-main">
            <div class="loading-skeleton loading-title"></div>
            <div class="loading-skeleton loading-url"></div>
            <div class="loading-skeleton loading-meta"></div>
          </div>
          <div class="loading-skeleton loading-image"></div>
        </div>
      </div>
    </div>

    <!-- URLリスト -->
    <div v-else-if="data.length > 0" class="url-list">
      <template v-for="(item, index) in props.data" :key="item.id">
        <OrganismsUrlLibraryRow
          :data="item"
          @click-note="emits('click-note', item.id)"
          @click-edit="emits('click-edit', item.id)"
          @click-delete="emits('click-delete', item.id)"
        />

        <!-- 3個おきに小さな広告を表示 -->
        <div v-if="(index + 1) % 3 === 0" class="ad-break">
          <AtomsAdSense
            ad-slot="1200848053"
            ad-format="auto"
            style="display: block; max-width: 320px; margin: 0 auto"
            class="content-ad"
          />
        </div>
      </template>
    </div>

    <!-- 空状態 -->
    <div v-else class="empty-state">
      <div class="empty-icon">
        <i class="fas fa-link"></i>
      </div>
      <h3 class="empty-title">URLがまだ登録されていません</h3>
      <p class="empty-description">
        最初のURLを追加して、あなたのライブラリを始めましょう
      </p>
      <button class="add-url-btn" @click="emits('add-url')">
        <i class="fas fa-plus"></i>
        URLを追加
      </button>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.url-library-list {
  width: 100%;

  .url-list {
    display: flex;
    flex-direction: column;
    gap: 0;

    .ad-break {
      margin: 1rem 0;
      padding: 0.5rem;
      background: $gray-50;
      border-radius: 6px;
      border: 1px solid $border-light;
      text-align: center;
      max-height: 120px !important; /* コンテンツ内広告の高さ制限 */
      overflow: hidden !important;

      .content-ad {
        max-width: 320px;
        margin: 0 auto;
        height: 100px !important;
        max-height: 100px !important;

        .adsbygoogle {
          height: 100px !important;
          max-height: 100px !important;
          width: 100% !important;
          max-width: 320px !important;
        }

        iframe {
          height: 100px !important;
          max-height: 100px !important;
          width: 100% !important;
          max-width: 320px !important;
        }
      }
    }
  }

  // ローディング状態
  .loading-state {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .loading-card {
      background: $white;
      border-radius: 12px;
      border: 1px solid $border;
      overflow: hidden;

      .loading-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 1rem 1.25rem;
        background: $gray-50;
        border-bottom: 1px solid $border-light;

        .loading-domain {
          width: 120px;
          height: 1rem;
        }

        .loading-actions {
          display: flex;
          gap: 0.5rem;

          .loading-btn {
            width: 2rem;
            height: 2rem;
            border-radius: 6px;
          }
        }
      }

      .loading-content {
        display: flex;
        gap: 1rem;
        padding: 1.25rem;

        .loading-main {
          flex: 1;

          .loading-title {
            width: 70%;
            height: 1.4rem;
            margin-bottom: 0.5rem;
          }

          .loading-url {
            width: 50%;
            height: 1rem;
            margin-bottom: 1rem;
          }

          .loading-meta {
            width: 40%;
            height: 0.8rem;
          }
        }

        .loading-image {
          width: 120px;
          height: 90px;
          border-radius: 8px;
          flex-shrink: 0;
        }
      }
    }
  }

  // 空状態
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 3rem 1.5rem;
    text-align: center;
    background: $white;
    border-radius: 12px;
    border: 1px solid $border;

    .empty-icon {
      width: 4rem;
      height: 4rem;
      background: $gray-100;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 1.5rem;

      i {
        font-size: 1.5rem;
        color: $text-muted;
      }
    }

    .empty-title {
      font-size: 1.25rem;
      font-weight: 600;
      color: $text;
      margin: 0 0 0.5rem 0;
    }

    .empty-description {
      font-size: 0.9rem;
      color: $text-muted;
      margin: 0 0 2rem 0;
      max-width: 400px;
      line-height: 1.5;
    }

    .add-url-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      padding: 0.75rem 1.5rem;
      background: $primary;
      color: $white;
      border: none;
      border-radius: 8px;
      font-size: 0.9rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $primary-hover;
        transform: translateY(-1px);
      }

      i {
        font-size: 0.8rem;
      }
    }
  }

  // ローディングスケルトン
  .loading-skeleton {
    background: linear-gradient(
      90deg,
      $gray-200 25%,
      $gray-100 50%,
      $gray-200 75%
    );
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
    border-radius: 4px;
  }
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .url-library-list {
    .loading-state .loading-card {
      .loading-content {
        flex-direction: column;
        gap: 0.75rem;

        .loading-image {
          width: 100%;
          height: 120px;
        }
      }
    }

    .empty-state {
      padding: 2rem 1rem;

      .empty-icon {
        width: 3rem;
        height: 3rem;
        margin-bottom: 1rem;

        i {
          font-size: 1.25rem;
        }
      }

      .empty-title {
        font-size: 1.1rem;
      }

      .empty-description {
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
      }

      .add-url-btn {
        padding: 0.625rem 1.25rem;
        font-size: 0.85rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .url-library-list {
    .empty-state {
      padding: 1.5rem 0.75rem;

      .empty-title {
        font-size: 1rem;
      }

      .empty-description {
        font-size: 0.8rem;
      }
    }
  }
}
</style>
