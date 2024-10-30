<script setup lang="ts">
type Props = {
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const emits = defineEmits(['close']);
</script>

<template>
  <div :class="['popup-frame', props.class]">
    <div class="popup-content">
      <button class="close-btn" @click="emits('close')"></button>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
// 背景を薄暗く
.popup-frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  .popup-content {
    position: relative;
    background-color: $white;
    padding: 1rem;
    border-radius: 5px;
    width: 80%;
    max-width: 1000px;
  }

  .close-btn {
    position: absolute;
    top: 0;
    right: 20px;
    background-color: transparent;
    border: none;
    font-size: 2rem;
    cursor: pointer;

    &::before {
      content: '×';
    }
  }
}
</style>
