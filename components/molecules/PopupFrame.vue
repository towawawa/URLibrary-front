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
    <div class="popup-backdrop" @click="emits('close')"></div>
    <div class="popup-content">
      <button class="close-btn" @click="emits('close')">
        <i class="fas fa-times"></i>
      </button>
      <slot></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.popup-frame {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;

  .popup-backdrop {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(2px);
  }

  .popup-content {
    position: relative;
    background-color: $white;
    border-radius: 12px;
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    width: 100%;
    max-width: 800px;
    max-height: 90vh;
    overflow-y: auto;
    z-index: 10000;
  }

  .close-btn {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 2rem;
    height: 2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: $gray-100;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    z-index: 10001;
    transition: all 0.2s ease;

    &:hover {
      background-color: $error-light;
      color: $error;
    }

    i {
      font-size: 0.875rem;
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .popup-frame {
    padding: 0.5rem;

    .popup-content {
      max-width: 100%;
      max-height: 95vh;
    }

    .close-btn {
      top: 0.75rem;
      right: 0.75rem;
      width: 1.75rem;
      height: 1.75rem;

      i {
        font-size: 0.75rem;
      }
    }
  }
}
</style>
