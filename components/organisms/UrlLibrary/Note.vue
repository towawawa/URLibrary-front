<script lang="ts" setup>
type Props = {
  class?: string;
  id: number;
};

const isFetching = ref(true);

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

const emits = defineEmits<{
  (event: 'close'): void;
}>();

// idが変わったらノートを取得
watch(
  () => props.id,
  () => {
    setNote();
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
      <button class="close-btn" @click="emits('close')">
        <i class="fas fa-times"></i>
      </button>
      <textarea
        class="note-textarea"
        placeholder="ここにメモを入力してください..."
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
          width: 90%;
        }

        &.medium {
          width: 70%;
        }

        &.short {
          width: 50%;
        }
      }
    }
  }
}

.note {
  width: 100%;
  height: 100%;
  position: relative;
  background: $white;
  border: 1px solid $border;
  border-radius: 8px;
  overflow: hidden;

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 2rem;
    height: 2rem;
    background: $gray-100;
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

  .note-textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    background: $white;
    padding: 3.5rem 1rem 1rem 1rem;
    font-size: 0.9rem;
    line-height: 1.6;
    color: $text;
    outline: none;

    &::placeholder {
      color: $text-muted;
      font-style: italic;
    }

    &:focus {
      background: $gray-50;
    }
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
  .note {
    .close-btn {
      top: 0.75rem;
      right: 0.75rem;
      width: 1.75rem;
      height: 1.75rem;

      i {
        font-size: 0.7rem;
      }
    }

    .note-textarea {
      padding: 3rem 0.75rem 0.75rem 0.75rem;
      font-size: 0.85rem;
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
