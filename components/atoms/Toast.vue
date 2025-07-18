<script lang="ts" setup>
import type { Toast } from '@/composables/toast';

type Props = {
  toast: Toast;
};

const props = defineProps<Props>();

const emits = defineEmits<{
  (event: 'remove', id: string): void;
}>();

const handleRemove = () => {
  emits('remove', props.toast.id);
};

// アイコンの選択
const getIcon = () => {
  switch (props.toast.type) {
    case 'success':
      return 'fas fa-check-circle';
    case 'error':
      return 'fas fa-exclamation-circle';
    case 'warning':
      return 'fas fa-exclamation-triangle';
    case 'info':
    default:
      return 'fas fa-info-circle';
  }
};
</script>

<template>
  <div :class="['toast', `toast--${toast.type}`]">
    <div class="toast__content">
      <i :class="['toast__icon', getIcon()]"></i>
      <span class="toast__message">{{ toast.message }}</span>
    </div>
    <button class="toast__close" @click="handleRemove">
      <i class="fas fa-times"></i>
    </button>
  </div>
</template>

<style lang="scss" scoped>
.toast {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  margin-bottom: 0.75rem;
  border-radius: 8px;
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(8px);
  min-width: 300px;
  max-width: 400px;
  border: 1px solid;
  transition: all 0.3s ease;

  &:hover {
    transform: translateX(-4px);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
  }

  &__content {
    display: flex;
    align-items: center;
    flex: 1;
    gap: 0.75rem;
  }

  &__icon {
    font-size: 1.125rem;
    flex-shrink: 0;
  }

  &__message {
    font-size: 0.9rem;
    font-weight: 500;
    line-height: 1.4;
    flex: 1;
  }

  &__close {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 1.5rem;
    height: 1.5rem;
    margin-left: 0.75rem;
    background: transparent;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    font-size: 0.75rem;
    transition: all 0.2s ease;
    flex-shrink: 0;

    &:hover {
      transform: scale(1.1);
    }

    &:active {
      transform: scale(0.95);
    }
  }

  // Success variant
  &--success {
    background: rgba(16, 185, 129, 0.95);
    border-color: rgba(5, 150, 105, 0.5);
    color: $white;

    .toast__close {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: $white;
      }
    }
  }

  // Error variant
  &--error {
    background: rgba(239, 68, 68, 0.95);
    border-color: rgba(220, 38, 38, 0.5);
    color: $white;

    .toast__close {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: $white;
      }
    }
  }

  // Warning variant
  &--warning {
    background: rgba(245, 158, 11, 0.95);
    border-color: rgba(217, 119, 6, 0.5);
    color: $white;

    .toast__close {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: $white;
      }
    }
  }

  // Info variant
  &--info {
    background: rgba(59, 130, 246, 0.95);
    border-color: rgba(37, 99, 235, 0.5);
    color: $white;

    .toast__close {
      color: rgba(255, 255, 255, 0.8);

      &:hover {
        background: rgba(255, 255, 255, 0.1);
        color: $white;
      }
    }
  }
}

// エンター・リーブ・トランジション
.toast-enter-active {
  transition: all 0.3s ease-out;
}

.toast-leave-active {
  transition: all 0.3s ease-in;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%);
}

// レスポンシブ対応
@media (max-width: 480px) {
  .toast {
    min-width: 280px;
    max-width: 320px;
    padding: 0.875rem 1rem;

    &__message {
      font-size: 0.85rem;
    }

    &__icon {
      font-size: 1rem;
    }
  }
}
</style>
