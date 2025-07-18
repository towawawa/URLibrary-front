<script setup lang="ts">
type Props = {
  class?: string;
  accept?: string;
  errorMessage?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  accept: 'image/*',
  errorMessage: '',
});

const emits = defineEmits<{
  (event: 'change', value: File | null): void;
}>();

const onChange = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0] || null;
  emits('change', file);
};
</script>

<template>
  <div :class="['file-input-container', props.class]">
    <input
      type="file"
      :accept="props.accept"
      :class="{ 'is-error': props.errorMessage }"
      @change="onChange($event)"
    />
    <p v-if="props.errorMessage" class="error-message">
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.file-input-container {
  position: relative;
  padding-bottom: 10px;
  
  input[type="file"] {
    width: 100%;
    padding: 8px;
    border: 1px solid $border;
    border-radius: 4px;
    font-size: 1rem;
    cursor: pointer;

    &.is-error {
      border-color: $error;
    }

    &::-webkit-file-upload-button {
      background-color: $primary;
      color: $white;
      border: none;
      padding: 6px 12px;
      border-radius: 4px;
      cursor: pointer;
      margin-right: 10px;
    }
  }

  .error-message {
    color: $error;
    position: absolute;
    font-size: 0.8rem;
  }
}
</style> 