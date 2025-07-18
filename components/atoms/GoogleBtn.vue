<script lang="ts" setup>
type Props = {
  class?: string;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  fullWidth: false,
  disabled: false,
  loading: false,
  class: '',
});

const emits = defineEmits<{
  (event: 'click'): void;
}>();

const handleClick = () => {
  if (!props.disabled && !props.loading) {
    emits('click');
  }
};
</script>

<template>
  <button
    :class="[
      'google-btn',
      `google-btn--${size}`,
      {
        'google-btn--full-width': fullWidth,
        'google-btn--disabled': disabled,
        'google-btn--loading': loading,
      },
      props.class,
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <div class="google-btn__content">
      <svg class="google-btn__icon" viewBox="0 0 24 24" width="20" height="20">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
      <span class="google-btn__text">
        <slot></slot>
      </span>
    </div>
  </button>
</template>

<style lang="scss" scoped>
.google-btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #dadce0;
  border-radius: 6px;
  background: $white;
  color: #3c4043;
  font-weight: 500;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  user-select: none;

  &:hover:not(.google-btn--disabled):not(.google-btn--loading) {
    box-shadow:
      0 1px 2px 0 rgba(60, 64, 67, 0.3),
      0 1px 3px 1px rgba(60, 64, 67, 0.15);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(66, 133, 244, 0.3);
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  &__icon {
    flex-shrink: 0;
    transition: all 0.2s ease;
  }

  &__text {
    font-size: inherit;
    line-height: 1;
  }

  // Sizes
  &--sm {
    padding: 0.5rem 1rem;
    font-size: 0.875rem;
    min-height: 2.25rem;

    .google-btn__icon {
      width: 16px;
      height: 16px;
    }
  }

  &--md {
    padding: 0.75rem 1.5rem;
    font-size: 0.9rem;
    min-height: 2.75rem;

    .google-btn__icon {
      width: 18px;
      height: 18px;
    }
  }

  &--lg {
    padding: 1rem 2rem;
    font-size: 1rem;
    min-height: 3.25rem;

    .google-btn__icon {
      width: 20px;
      height: 20px;
    }
  }

  // States
  &--full-width {
    width: 100%;
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none !important;
    box-shadow: none !important;
  }

  &--loading {
    cursor: wait;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .google-btn {
    &--sm {
      padding: 0.375rem 0.75rem;
      font-size: 0.8rem;
      min-height: 2rem;
    }

    &--md {
      padding: 0.5rem 1rem;
      font-size: 0.85rem;
      min-height: 2.5rem;
    }

    &--lg {
      padding: 0.75rem 1.5rem;
      font-size: 0.9rem;
      min-height: 3rem;
    }
  }
}
</style>
