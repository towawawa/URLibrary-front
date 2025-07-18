<script setup lang="ts">
type Props = {
  class?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  disabled?: boolean;
  loading?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  variant: 'primary',
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
      'btn',
      `btn--${variant}`,
      `btn--${size}`,
      {
        'btn--full-width': fullWidth,
        'btn--disabled': disabled,
        'btn--loading': loading,
      },
      props.class,
    ]"
    :disabled="disabled || loading"
    @click="handleClick"
  >
    <i v-if="loading" class="fas fa-spinner btn__spinner"></i>
    <span class="btn__content" :class="{ 'btn__content--loading': loading }">
      <slot></slot>
    </span>
  </button>
</template>

<style lang="scss" scoped>
.btn {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border: 1px solid transparent;
  border-radius: 6px;
  font-weight: 500;
  font-family: inherit;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
  user-select: none;

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.5);
  }

  // Variants
  &--primary {
    background: $primary;
    color: $white;
    border-color: $primary;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $primary-hover;
      border-color: $primary-hover;
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(116, 160, 67, 0.25);
    }

    &:active {
      transform: translateY(0);
    }
  }

  &--secondary {
    background: $gray-100;
    color: $text;
    border-color: $gray-200;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $gray-200;
      border-color: $gray-300;
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }
  }

  &--outline {
    background: transparent;
    color: $primary;
    border-color: $primary;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $primary;
      color: $white;
      transform: translateY(-1px);
    }
  }

  &--ghost {
    background: transparent;
    color: $text;
    border-color: transparent;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: $gray-100;
    }
  }

  &--danger {
    background: $error;
    color: $white;
    border-color: $error;

    &:hover:not(.btn--disabled):not(.btn--loading) {
      background: darken($error, 10%);
      border-color: darken($error, 10%);
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(239, 68, 68, 0.25);
    }
  }

  // Sizes
  &--sm {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
    min-height: 2rem;
  }

  &--md {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
    min-height: 2.5rem;
  }

  &--lg {
    padding: 0.75rem 1.5rem;
    font-size: 1rem;
    min-height: 3rem;
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

  &__spinner {
    animation: spin 1s linear infinite;
    font-size: 0.9em;
  }

  &__content {
    transition: opacity 0.2s ease;

    &--loading {
      opacity: 0.7;
    }
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

// レスポンシブ対応
@media (max-width: 768px) {
  .btn {
    &--sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      min-height: 1.75rem;
    }

    &--md {
      padding: 0.375rem 0.75rem;
      font-size: 0.85rem;
      min-height: 2.25rem;
    }

    &--lg {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
      min-height: 2.75rem;
    }
  }
}
</style>
