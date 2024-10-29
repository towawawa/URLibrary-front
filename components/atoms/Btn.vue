<script setup lang="ts">
type Props = {
  class?: string;
  color?: 'primary' | 'gray';
};

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  class: '',
});

const emits = defineEmits<{
  (event: 'click'): void;
}>();
</script>

<template>
  <button :class="[props.class, props.color]" @click="emits('click')">
    <slot></slot>
  </button>
</template>

<style lang="scss" scoped>
button {
  display: block;
  height: 45px;
  width: 200px;
  border: none;
  border-radius: 20px;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s;
  font-size: 0.9rem;
  &.primary {
    background-color: $primary;
    &:hover {
      background-color: $primary-hover;
    }
  }
  &.gray {
    background-color: $gray;
    &:hover {
      background-color: $gray-hover;
    }
  }
}
</style>
