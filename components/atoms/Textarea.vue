<script setup lang="ts" generic="T extends number | string | null">
type Props = {
  class?: string;
  value: T;
  errorMessage?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  errorMessage: '',
});

const emits = defineEmits<{
  (event: 'change', value: T): void;
}>();

const onChange = (event: Event): void => {
  emits('change', (event.target as HTMLInputElement).value as T);
};
</script>

<template>
  <div :class="['input-container', props.class]">
    <textarea
      :value="props.value"
      :class="{ 'is-error': props.errorMessage }"
      @change="onChange($event)"
    >
    {{ props.value }}
    </textarea>
    <p v-if="props.errorMessage" class="error-message">
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  position: relative;
  padding-bottom: 10px;
  textarea {
    width: 100%;
    height: 200px;
    padding: 8px;
    border: 1px solid $border;
    border-radius: 4px;
    font-size: 1rem;

    &.is-error {
      border-color: $error;
    }
  }
  .error-message {
    color: $error;
    position: absolute;
    font-size: 0.8rem;
  }
}
</style>
