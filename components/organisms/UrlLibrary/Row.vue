<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { UrlLibrary } from '@/types/api/urlLibrary';

type Props = {
  class?: string;
  data: UrlLibrary;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

// OGP画像のURLを格納するリアクティブデータ
const ogpImageUrl = ref<string | null>(null);
const isLoadingOgp = ref(true);
const ogpError = ref(false);

// OGP画像を取得する関数
const fetchOGP = async (url: string) => {
  try {
    isLoadingOgp.value = true;
    ogpError.value = false;

    // URLの有効性をチェック
    let parsedUrl;
    try {
      parsedUrl = new URL(url);
    } catch {
      ogpError.value = true;
      return;
    }

    // ローカルホストやプライベートIPアドレスをスキップ
    const hostname = parsedUrl.hostname.toLowerCase();
    if (
      hostname === 'localhost' ||
      hostname === '127.0.0.1' ||
      hostname.startsWith('192.168.') ||
      hostname.startsWith('10.') ||
      hostname.startsWith('172.') ||
      hostname.endsWith('.local') ||
      !hostname.includes('.')
    ) {
      ogpError.value = true;
      return;
    }

    // HTTPSでない場合もスキップ（CORSプロキシの制限）
    if (parsedUrl.protocol !== 'https:') {
      ogpError.value = true;
      return;
    }

    //urlの末尾に/をつける
    if (!url.endsWith('/')) {
      url += '/';
    }

    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();
    const domParser = new DOMParser();
    const dom = domParser.parseFromString(html, 'text/html');
    const ogp = Object.fromEntries(
      [...dom.head.children]
        .filter(
          (element) =>
            element.tagName === 'META' &&
            element.getAttribute('property')?.startsWith('og:'),
        )
        .map((element) => {
          return [
            element.getAttribute('property'),
            element.getAttribute('content'),
          ];
        }),
    );
    ogpImageUrl.value = ogp['og:image'] || null;
  } catch (error) {
    console.error('OGP取得エラー:', error);
    ogpError.value = true;
  } finally {
    isLoadingOgp.value = false;
  }
};

const emits = defineEmits<{
  (event: 'click-note'): void;
  (event: 'click-edit'): void;
  (event: 'click-delete'): void;
}>();

// URLからドメイン名を取得
const getDomain = (url: string) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

// 相対時間の表示
const getRelativeTime = (date: string) => {
  const { $dayjs } = useNuxtApp();
  return $dayjs(date).fromNow();
};

// コンポーネントがマウントされたときにOGP画像を取得
onMounted(() => {
  fetchOGP(props.data.url);
});
</script>

<template>
  <article class="url-card" :class="props.class">
    <!-- カードヘッダー -->
    <div class="card-header">
      <div class="domain-info">
        <i class="fas fa-globe domain-icon"></i>
        <span class="domain-name">{{ getDomain(data.url) }}</span>
      </div>
      <div class="actions">
        <button
          class="action-btn edit-btn"
          @click="emits('click-edit')"
          title="編集"
        >
          <i class="fas fa-edit"></i>
        </button>
        <button
          class="action-btn note-btn"
          @click="emits('click-note')"
          title="ノート"
        >
          <i class="fas fa-sticky-note"></i>
        </button>
        <button
          class="action-btn delete-btn"
          @click="emits('click-delete')"
          title="削除"
        >
          <i class="fas fa-trash"></i>
        </button>
      </div>
    </div>

    <!-- カードコンテンツ -->
    <div class="card-content">
      <div class="content-main">
        <a :href="data.url" target="_blank" class="url-link">
          <h3 class="url-title">{{ data.title }}</h3>
          <p class="url-address">{{ data.url }}</p>
        </a>

        <!-- ハッシュタグ -->
        <div v-if="data.hashTags.length > 0" class="hash-tags">
          <AtomsHashTagText
            v-for="tag in data.hashTags"
            :key="tag.id"
            :name="tag.name"
          />
        </div>

        <!-- メタ情報 -->
        <div class="meta-info">
          <span class="created-date">
            <i class="fas fa-calendar-alt"></i>
            {{ getRelativeTime(data.createdAt) }}
          </span>
          <span v-if="data.genre" class="genre">
            <i class="fas fa-folder"></i>
            {{ data.genre.name }}
          </span>
        </div>
      </div>

      <!-- OGP画像 -->
      <div class="ogp-container">
        <div v-if="isLoadingOgp" class="ogp-loading">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <img
          v-else-if="ogpImageUrl && !ogpError"
          :src="ogpImageUrl"
          :alt="data.title"
          class="ogp-image"
          @error="ogpError = true"
        />
        <div v-else class="ogp-placeholder">
          <i class="fas fa-image"></i>
        </div>
      </div>
    </div>
  </article>
</template>

<style lang="scss" scoped>
.url-card {
  background: $white;
  border-radius: 12px;
  border: 1px solid $border;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  overflow: hidden;
  margin-bottom: 1rem;

  &:hover {
    box-shadow: 0 4px 12px 0 rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.25rem;
    border-bottom: 1px solid $border-light;
    background: $gray-50;

    .domain-info {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      color: $text-muted;
      font-size: 0.85rem;

      .domain-icon {
        font-size: 0.8rem;
      }

      .domain-name {
        font-weight: 500;
      }
    }

    .actions {
      display: flex;
      gap: 0.5rem;

      .action-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 2rem;
        height: 2rem;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        transition: all 0.2s ease;
        font-size: 0.8rem;

        &.edit-btn {
          background: $primary-light;
          color: $primary;

          &:hover {
            background: $primary;
            color: $white;
          }
        }

        &.note-btn {
          background: $blue-light;
          color: $blue;

          &:hover {
            background: $blue;
            color: $white;
          }
        }

        &.delete-btn {
          background: $error-light;
          color: $error;

          &:hover {
            background: $error;
            color: $white;
          }
        }
      }
    }
  }

  .card-content {
    display: flex;
    gap: 1.5rem;
    padding: 1.25rem;

    .content-main {
      flex: 1;
      min-width: 0;

      .url-link {
        text-decoration: none;
        color: inherit;
        display: block;
        margin-bottom: 1rem;

        &:hover .url-title {
          color: $primary;
        }
      }

      .url-title {
        font-size: 1.1rem;
        font-weight: 600;
        color: $text;
        margin: 0 0 0.5rem 0;
        line-height: 1.4;
        transition: color 0.2s ease;

        // 長いタイトルの省略
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .url-address {
        font-size: 0.85rem;
        color: $url-text;
        margin: 0;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .hash-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 1rem;
      }

      .meta-info {
        display: flex;
        gap: 1rem;
        font-size: 0.8rem;
        color: $text-muted;

        span {
          display: flex;
          align-items: center;
          gap: 0.375rem;

          i {
            font-size: 0.75rem;
          }
        }
      }
    }

    .ogp-container {
      width: 265px;
      height: 135px;
      border-radius: 8px;
      overflow: hidden;
      background: $gray-100;
      flex-shrink: 0;
      display: flex;
      align-items: center;
      justify-content: center;

      .ogp-loading {
        color: $text-muted;
        font-size: 1.2rem;
      }

      .ogp-image {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .ogp-placeholder {
        color: $text-muted;
        font-size: 1.5rem;
      }
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .url-card {
    .card-header {
      padding: 0.75rem 1rem;

      .domain-info {
        font-size: 0.8rem;
      }

      .actions {
        gap: 0.375rem;

        .action-btn {
          width: 1.75rem;
          height: 1.75rem;
          font-size: 0.75rem;
        }
      }
    }

    .card-content {
      flex-direction: column;
      padding: 1rem;
      gap: 0.75rem;

      .content-main {
        .url-title {
          font-size: 1rem;
        }

        .url-address {
          font-size: 0.8rem;
        }

        .meta-info {
          flex-direction: column;
          gap: 0.5rem;
          font-size: 0.75rem;
        }
      }

      .ogp-container {
        width: 100%;
        height: 150px;
        align-self: center;
      }
    }
  }
}

@media (max-width: 480px) {
  .url-card {
    margin-bottom: 0.75rem;

    .card-header {
      padding: 0.5rem 0.75rem;

      .domain-info {
        font-size: 0.75rem;
        gap: 0.375rem;
      }
    }

    .card-content {
      padding: 0.75rem;

      .content-main {
        .url-title {
          font-size: 0.95rem;
        }

        .hash-tags {
          gap: 0.375rem;
        }
      }

      .ogp-container {
        height: 120px;
      }
    }
  }
}
</style>
