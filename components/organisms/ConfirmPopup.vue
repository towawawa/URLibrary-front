<script lang="ts" setup>
type Props = {
  message: string;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
const emits = defineEmits(['close', 'confirm']);
</script>

<template>
  <MoleculesPopupFrame @close="emits('close')">
    <p>{{ props.message }}</p>
    <div class="button-area">
      <AtomsBtn class="confirm-btn" color="primary" @click="emits('confirm')">
        OK
      </AtomsBtn>
      <AtomsBtn class="cancel-btn" color="gray" @click="emits('close')">
        キャンセル
      </AtomsBtn>
    </div>
  </MoleculesPopupFrame>
</template>

<style lang="scss" scoped>
p {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  padding: 80px 0;
}

.button-area {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}
</style>
