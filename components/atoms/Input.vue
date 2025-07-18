<script setup lang="ts" generic="T extends number | string | null">
type Props = {
  class?: string;
  type?: 'month' | 'email' | 'number' | 'password' | 'text' | 'search';
  value: T;
  errorMessage?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  type: 'text',
  errorMessage: '',
  placeholder: '',
  disabled: false,
  readonly: false,
  size: 'md',
});

const emits = defineEmits<{
  (event: 'change', value: T): void;
  (event: 'input', value: T): void;
  (event: 'focus', event: FocusEvent): void;
  (event: 'blur', event: FocusEvent): void;
}>();

const onChange = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value as T;
  emits('change', value);
};

const onInput = (event: Event): void => {
  const value = (event.target as HTMLInputElement).value as T;
  emits('input', value);
};

const onFocus = (event: FocusEvent): void => {
  emits('focus', event);
};

const onBlur = (event: FocusEvent): void => {
  emits('blur', event);
};
</script>

<template>
  <div :class="['input-wrapper', `input-wrapper--${size}`, props.class]">
    <div
      class="input-container"
      :class="{
        'input-container--error': errorMessage,
        'input-container--disabled': disabled,
      }"
    >
      <input
        :value="props.value"
        :type="props.type"
        :placeholder="props.placeholder"
        :disabled="disabled"
        :readonly="readonly"
        class="input-field"
        @change="onChange($event)"
        @input="onInput($event)"
        @focus="onFocus($event)"
        @blur="onBlur($event)"
      />
    </div>

    <Transition name="error-fade">
      <div v-if="errorMessage" class="error-message">
        <i class="fas fa-exclamation-circle error-icon"></i>
        <span>{{ errorMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<style lang="scss" scoped>
.input-wrapper {
  width: 100%;

  .input-container {
    position: relative;

    .input-field {
      width: 100%;
      border: 1px solid $border;
      border-radius: 6px;
      background: $white;
      color: $text;
      font-family: inherit;
      transition: all 0.2s ease;

      &::placeholder {
        color: $text-muted;
      }

      &:focus {
        outline: none;
        border-color: $primary;
        box-shadow: 0 0 0 2px rgba(116, 160, 67, 0.1);
      }

      &:disabled {
        background: $gray-100;
        color: $text-muted;
        cursor: not-allowed;
      }

      &:readonly {
        background: $gray-50;
        cursor: default;
      }
    }

    &--error .input-field {
      border-color: $error;

      &:focus {
        border-color: $error;
        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1);
      }
    }

    &--disabled {
      opacity: 0.6;
    }
  }

  .error-message {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    margin-top: 0.375rem;
    color: $error;
    font-size: 0.8rem;
    font-weight: 500;

    .error-icon {
      font-size: 0.75rem;
      flex-shrink: 0;
    }
  }

  // Sizes
  &--sm .input-field {
    padding: 0.375rem 0.75rem;
    font-size: 0.8rem;
    min-height: 2rem;
  }

  &--md .input-field {
    padding: 0.5rem 0.75rem;
    font-size: 0.9rem;
    min-height: 2.5rem;
  }

  &--lg .input-field {
    padding: 0.75rem 1rem;
    font-size: 1rem;
    min-height: 3rem;
  }
}

// Transitions
.error-fade-enter-active,
.error-fade-leave-active {
  transition: all 0.3s ease;
}

.error-fade-enter-from,
.error-fade-leave-to {
  opacity: 0;
  transform: translateY(-0.5rem);
}

// レスポンシブ対応
@media (max-width: 768px) {
  .input-wrapper {
    &--sm .input-field {
      padding: 0.25rem 0.5rem;
      font-size: 0.75rem;
      min-height: 1.75rem;
    }

    &--md .input-field {
      padding: 0.375rem 0.75rem;
      font-size: 0.85rem;
      min-height: 2.25rem;
    }

    &--lg .input-field {
      padding: 0.5rem 0.75rem;
      font-size: 0.9rem;
      min-height: 2.75rem;
    }

    .error-message {
      font-size: 0.75rem;
    }
  }
}
</style>
