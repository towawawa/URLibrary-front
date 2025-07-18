<script lang="ts" setup>
type Props = {
  message: string;
  title?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  title: '確認',
  confirmText: '削除',
  cancelText: 'キャンセル',
  variant: 'danger',
});

const emits = defineEmits(['close', 'confirm']);

// バリアントに応じたアイコンとカラー
const getVariantInfo = (variant: string) => {
  switch (variant) {
    case 'danger':
      return {
        icon: 'fas fa-exclamation-triangle',
        iconColor: 'text-error',
        bgColor: 'bg-error-light',
      };
    case 'warning':
      return {
        icon: 'fas fa-exclamation-circle',
        iconColor: 'text-warning',
        bgColor: 'bg-warning-light',
      };
    case 'info':
      return {
        icon: 'fas fa-info-circle',
        iconColor: 'text-info',
        bgColor: 'bg-info-light',
      };
    default:
      return {
        icon: 'fas fa-question-circle',
        iconColor: 'text-primary',
        bgColor: 'bg-primary-light',
      };
  }
};

const variantInfo = getVariantInfo(props.variant);
</script>

<template>
  <MoleculesPopupFrame @close="emits('close')">
    <div class="confirm-container">
      <!-- アイコンエリア -->
      <div class="icon-area" :class="variantInfo.bgColor">
        <i :class="[variantInfo.icon, variantInfo.iconColor]"></i>
      </div>

      <!-- コンテンツエリア -->
      <div class="content-area">
        <h3 class="confirm-title">{{ props.title }}</h3>
        <p class="confirm-message">{{ props.message }}</p>
      </div>

      <!-- ボタンエリア -->
      <div class="button-area">
        <AtomsBtn
          class="cancel-btn"
          variant="secondary"
          size="md"
          @click="emits('close')"
        >
          {{ props.cancelText }}
        </AtomsBtn>
        <AtomsBtn
          class="confirm-btn"
          :variant="props.variant === 'danger' ? 'danger' : 'primary'"
          size="md"
          @click="emits('confirm')"
        >
          {{ props.confirmText }}
        </AtomsBtn>
      </div>
    </div>
  </MoleculesPopupFrame>
</template>

<style lang="scss" scoped>
.confirm-container {
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: $white;
  border-radius: 16px;
}

.icon-area {
  width: 4rem;
  height: 4rem;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;

  i {
    font-size: 1.75rem;
  }

  &.bg-error-light {
    background-color: rgba(239, 68, 68, 0.1);
  }

  &.bg-warning-light {
    background-color: rgba(245, 158, 11, 0.1);
  }

  &.bg-info-light {
    background-color: rgba(59, 130, 246, 0.1);
  }

  &.bg-primary-light {
    background-color: rgba(99, 102, 241, 0.1);
  }

  .text-error {
    color: $error;
  }

  .text-warning {
    color: #f59e0b;
  }

  .text-info {
    color: #3b82f6;
  }

  .text-primary {
    color: $primary;
  }
}

.content-area {
  margin-bottom: 2rem;

  .confirm-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: $text;
    margin: 0 0 0.75rem 0;
  }

  .confirm-message {
    font-size: 0.95rem;
    color: $text-muted;
    line-height: 1.6;
    margin: 0;
  }
}

.button-area {
  display: flex;
  gap: 0.75rem;
  justify-content: center;

  .cancel-btn,
  .confirm-btn {
    min-width: 100px;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .confirm-container {
    max-width: 90vw;
    padding: 1.5rem;

    .icon-area {
      width: 3.5rem;
      height: 3.5rem;
      margin-bottom: 1.25rem;

      i {
        font-size: 1.5rem;
      }
    }

    .content-area {
      margin-bottom: 1.5rem;

      .confirm-title {
        font-size: 1.125rem;
        margin-bottom: 0.5rem;
      }

      .confirm-message {
        font-size: 0.9rem;
      }
    }

    .button-area {
      flex-direction: column;
      gap: 0.5rem;

      .cancel-btn,
      .confirm-btn {
        width: 100%;
        min-width: auto;
      }
    }
  }
}

@media (max-width: 480px) {
  .confirm-container {
    max-width: 95vw;
    padding: 1.25rem;

    .icon-area {
      width: 3rem;
      height: 3rem;
      margin-bottom: 1rem;

      i {
        font-size: 1.25rem;
      }
    }

    .content-area {
      .confirm-title {
        font-size: 1rem;
      }

      .confirm-message {
        font-size: 0.85rem;
      }
    }
  }
}
</style>
