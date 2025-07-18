<script lang="ts" setup>
import { parseMarkdown } from '@/utils/markdown';

type Props = {
  class?: string;
  id: number;
};

const isFetching = ref(true);
const isEditMode = ref(false); // プレビューモード（false）、編集モード（true）

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const form = useForm<{
  note: string;
}>({
  note: '',
});

const setNote = async () => {
  isFetching.value = true;
  await fetcher('GET', `/url-libraries/${props.id}`).then((res) => {
    form.update('note', (res.data as UrlLibrary).note);
    isFetching.value = false;
  });
};

const updateNote = async (event: Event) => {
  form.update('note', (event.target as HTMLTextAreaElement).value);
  await fetcher('PUT', `/url-libraries/${props.id}/note`, {
    body: {
      note: form.data.note,
    },
  });
};

// マークダウンをHTMLに変換
const parsedMarkdown = computed(() => {
  return parseMarkdown(form.data.note);
});

// プレビュー/編集モードの切り替え
const toggleMode = () => {
  isEditMode.value = !isEditMode.value;
};

const emits = defineEmits<{
  (event: 'close'): void;
}>();

// idが変わったらノートを取得し、プレビューモードにリセット
watch(
  () => props.id,
  () => {
    setNote();
    isEditMode.value = false; // 新しいメモを開く時はプレビューモード
  },
  { immediate: true },
);
</script>

<template>
  <div class="note-container">
    <!-- ローディング状態 -->
    <div v-if="isFetching" class="note-loading">
      <div class="loading-header">
        <div class="loading-close-btn" @click="emits('close')">
          <i class="fas fa-times"></i>
        </div>
      </div>
      <div class="loading-content">
        <div class="loading-spinner">
          <i class="fas fa-spinner fa-spin"></i>
        </div>
        <p class="loading-text">メモを読み込み中...</p>
        <div class="loading-skeleton">
          <div class="skeleton-line long"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line short"></div>
          <div class="skeleton-line medium"></div>
          <div class="skeleton-line long"></div>
        </div>
      </div>
    </div>

    <!-- ノート表示 -->
    <div v-else class="note">
      <div class="note-header">
        <button
          class="mode-toggle-btn"
          @click="toggleMode"
          :title="
            isEditMode ? 'プレビューモードに切り替え' : '編集モードに切り替え'
          "
        >
          <i :class="isEditMode ? 'fas fa-eye' : 'fas fa-edit'"></i>
          {{ isEditMode ? 'プレビュー' : '編集' }}
        </button>
        <button class="close-btn" @click="emits('close')">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <!-- プレビューモード -->
      <div
        v-if="!isEditMode"
        class="note-preview"
        v-html="parsedMarkdown"
      ></div>

      <!-- 編集モード -->
      <textarea
        v-else
        class="note-textarea"
        placeholder="ここにメモを入力してください...

# マークダウン記法が使えます
- リスト
- **太字**
- *斜体*
- [リンク](URL)

## コードスニペット
インラインコード: `console.log('Hello');`

コードブロック:
```javascript
function greet(name) {
  console.log(`Hello, ${name}!`);
}
```

```python
def greet(name):
    print(f'Hello, {name}!')
```"
        @change="updateNote($event)"
        >{{ form.data.note }}</textarea
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.note-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.note-loading {
  width: 100%;
  height: 100%;
  background: $white;
  border: 1px solid $border;
  border-radius: 8px;
  overflow: hidden;

  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid $border-light;
    background: $gray-50;
  }

  .mode-toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: $primary-light;
    color: $primary;
    border: 1px solid $primary-light;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    i {
      font-size: 0.8rem;
    }
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: $gray-200;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $error-light;
      color: $error;
    }

    i {
      font-size: 0.8rem;
    }
  }

  .loading-header {
    display: flex;
    justify-content: flex-end;
    padding: 1rem;
    border-bottom: 1px solid $border-light;
    background: $gray-50;

    .loading-close-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 2rem;
      height: 2rem;
      background: $gray-200;
      border: none;
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.2s ease;

      &:hover {
        background: $error-light;
        color: $error;
      }

      i {
        font-size: 0.8rem;
      }
    }
  }

  .loading-content {
    padding: 2rem;
    text-align: center;

    .loading-spinner {
      font-size: 2rem;
      color: $primary;
      margin-bottom: 1rem;
    }

    .loading-text {
      color: $text-muted;
      font-size: 0.9rem;
      margin-bottom: 2rem;
    }

    .loading-skeleton {
      text-align: left;

      .skeleton-line {
        height: 0.8rem;
        background: linear-gradient(
          90deg,
          $gray-200 25%,
          $gray-100 50%,
          $gray-200 75%
        );
        background-size: 200% 100%;
        animation: loading 1.5s infinite;
        border-radius: 4px;
        margin-bottom: 0.75rem;

        &.long {
          width: 80%;
        }

        &.medium {
          width: 60%;
        }

        &.short {
          width: 40%;
        }
      }
    }
  }
}

.note {
  width: 100%;
  height: 100%;
  background: $white;
  border: 1px solid $border;
  border-radius: 8px;
  overflow: hidden;

  .note-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid $border-light;
    background: $gray-50;
  }

  .mode-toggle-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: $primary-light;
    color: $primary;
    border: 1px solid $primary-light;
    border-radius: 6px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    i {
      font-size: 0.8rem;
    }
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: $gray-200;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $error-light;
      color: $error;
    }

    i {
      font-size: 0.8rem;
    }
  }

  .note-preview {
    width: 100%;
    height: 100%;
    padding: 1rem;
    overflow-y: auto;
    font-size: 1rem;
    line-height: 1.6;
    color: $text;
    background: $white;
    border-radius: 0 0 8px 8px;
    border: 1px solid $border;
    border-top: none;

    p {
      margin-bottom: 0.5rem;
    }

    strong {
      font-weight: 600;
    }

    em {
      font-style: italic;
    }

    code {
      background-color: $gray-100;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-size: 0.9rem;
      font-family:
        'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Menlo',
        monospace;
      color: #d73a49; // コード専用の色
    }

    pre {
      background-color: #f6f8fa;
      border: 1px solid #e1e4e8;
      border-radius: 8px;
      padding: 1rem;
      margin: 1rem 0;
      overflow-x: auto;
      line-height: 1.4;

      code {
        background: none;
        padding: 0;
        color: inherit; // preの中では継承色を使用
        font-size: 0.85rem;
      }
    }

    // シンタックスハイライト用の追加スタイル
    .hljs {
      background: #f6f8fa !important;
      color: #24292e;
    }

    // コードブロックのコピーボタン用スペース
    pre:hover {
      background-color: #f1f3f5;
    }

    a {
      color: $primary;
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 1rem 0 0.5rem 0;
      font-weight: 600;
    }

    h1 {
      font-size: 1.4rem;
    }
    h2 {
      font-size: 1.3rem;
    }
    h3 {
      font-size: 1.2rem;
    }
    h4 {
      font-size: 1.1rem;
    }
    h5 {
      font-size: 1rem;
    }
    h6 {
      font-size: 1rem;
    }

    blockquote {
      border-left: 4px solid $primary-light;
      padding-left: 1rem;
      margin: 1rem 0;
      color: $text-muted;
      font-style: italic;
    }
  }

  .note-textarea {
    width: 100%;
    height: 100%;
    padding: 1rem;
    border: none;
    background: transparent;
    resize: none;
    outline: none;
    font-size: 0.9rem;
    line-height: 1.6;
    color: $text;
    font-family: inherit;

    &::placeholder {
      color: $text-muted;
    }

    &:focus {
      border: none;
      box-shadow: none;
    }
  }
}

// v-htmlでレンダリングされたコンテンツに対するスタイル
.note-preview :deep(ul) {
  margin: 0.5rem 0 !important;
  padding-left: 2rem !important;
  list-style: disc !important;
}

.note-preview :deep(ul ul) {
  margin: 0.25rem 0 !important;
  padding-left: 1.5rem !important;
  list-style: circle !important;
}

.note-preview :deep(ul ul ul) {
  list-style: square !important;
}

.note-preview :deep(ol) {
  margin: 0.5rem 0 !important;
  padding-left: 2rem !important;
  list-style: decimal !important;
}

.note-preview :deep(ol ol) {
  margin: 0.25rem 0 !important;
  padding-left: 1.5rem !important;
  list-style: lower-alpha !important;
}

.note-preview :deep(ol ol ol) {
  list-style: lower-roman !important;
}

.note-preview :deep(li) {
  margin-bottom: 0.25rem !important;
  display: list-item !important;
  padding-left: 0.5rem;
}

.note-preview :deep(li > p) {
  margin: 0;
  display: inline;
}

// コードブロックのスタイル
.note-preview :deep(pre) {
  position: relative;
  background-color: #f6f8fa !important;
  border: 1px solid #e1e4e8 !important;
  border-radius: 8px !important;
  padding: 1rem !important;
  margin: 1rem 0 !important;
  overflow-x: auto !important;
  line-height: 1.4 !important;
  font-family:
    'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Menlo',
    monospace !important;
}

.note-preview :deep(pre code) {
  background: none !important;
  padding: 0 !important;
  border-radius: 0 !important;
  font-size: 0.85rem !important;
  color: inherit !important;
}

.note-preview :deep(code) {
  background-color: rgba(175, 184, 193, 0.2) !important;
  padding: 0.2rem 0.4rem !important;
  border-radius: 3px !important;
  font-size: 0.9rem !important;
  font-family:
    'SFMono-Regular', 'Monaco', 'Consolas', 'Liberation Mono', 'Menlo',
    monospace !important;
  color: #d73a49 !important;
}

// highlight.jsの特定のクラスをオーバーライド
.note-preview :deep(.hljs) {
  background: #f6f8fa !important;
  color: #24292e !important;
  font-size: 0.85rem !important;
}

.note-preview :deep(.hljs-keyword) {
  color: #d73a49 !important;
  font-weight: 600;
}

.note-preview :deep(.hljs-string) {
  color: #032f62 !important;
}

.note-preview :deep(.hljs-comment) {
  color: #6a737d !important;
  font-style: italic;
}

.note-preview :deep(.hljs-function) {
  color: #6f42c1 !important;
}

.note-preview :deep(.hljs-number) {
  color: #005cc5 !important;
}

// スケルトンアニメーション
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
  .note {
    .note-header {
      padding: 0.75rem;
    }

    .mode-toggle-btn {
      padding: 0.4rem 0.8rem;
      font-size: 0.75rem;

      i {
        font-size: 0.7rem;
      }
    }

    .close-btn {
      width: 1.75rem;
      height: 1.75rem;

      i {
        font-size: 0.7rem;
      }
    }

    .note-textarea {
      padding: 0.75rem;
      font-size: 0.85rem;
    }

    .note-preview {
      padding: 0.75rem;
      font-size: 0.9rem; /* 0.85rem から 0.9rem に変更 */
    }
  }

  .note-loading {
    .loading-content {
      padding: 1.5rem;

      .loading-spinner {
        font-size: 1.5rem;
      }

      .loading-text {
        font-size: 0.8rem;
        margin-bottom: 1.5rem;
      }
    }
  }
}
</style>
