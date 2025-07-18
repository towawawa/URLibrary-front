<script lang="ts" setup>
const { toasts, removeToast } = useToast();

const handleRemoveToast = (id: string) => {
  removeToast(id);
};
</script>

<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast" tag="div" class="toast-list">
        <AtomsToast
          v-for="toast in toasts"
          :key="toast.id"
          :toast="toast"
          @remove="handleRemoveToast"
        />
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.toast-container {
  position: fixed;
  top: 5rem;
  right: 1.5rem;
  z-index: 9999;
  pointer-events: none;

  .toast-list {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  :deep(.toast) {
    pointer-events: auto;
  }
}

// トランジション
.toast-move,
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(100%) scale(0.95);
}

.toast-leave-active {
  position: absolute !important;
  right: 0;
}

// レスポンシブ対応
@media (max-width: 768px) {
  .toast-container {
    top: 4rem;
    right: 1rem;
    left: 1rem;

    .toast-list {
      align-items: stretch;
    }

    :deep(.toast) {
      max-width: none;
      min-width: auto;
    }
  }
}

@media (max-width: 480px) {
  .toast-container {
    top: 3.5rem;
    right: 0.75rem;
    left: 0.75rem;
  }
}
</style>
