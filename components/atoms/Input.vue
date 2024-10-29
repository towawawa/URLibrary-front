<script setup lang="ts" generic="T extends number | string | null">
type Props = {
  type?: 'date' | 'email' | 'number' | 'password' | 'text';
  value: T;
  errorMessage?: string;
};

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
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
  <div class="input-container">
    <input
      :value="props.value"
      :type="props.type"
      :class="{ 'is-error': props.errorMessage }"
      @change="onChange($event)"
    />
    <p v-if="props.errorMessage" class="error-message">
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<style lang="scss" scoped>
.input-container {
  position: relative;
  padding-bottom: 10px;
  input {
    width: 100%;
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
    font-size: 0.8rem
  }
}
</style>
