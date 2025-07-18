<script setup lang="ts">
type Props = {
  class?: string;
  value: string;
};
const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { $dayjs } = useNuxtApp();

const emits = defineEmits<{
  (event: 'change', value: string): void;
}>();

const upMonth = (): void => {
  const date = $dayjs(props.value).add(1, 'month').format('YYYY-MM');
  emits('change', date);
};

const downMonth = (): void => {
  const date = $dayjs(props.value).subtract(1, 'month').format('YYYY-MM');
  emits('change', date);
};
</script>

<template>
  <fieldset :class="props.class">
    <button @click="downMonth()">◀</button>
    <AtomsInput type="month" :value="value" @change="emits('change', $event)" />
    <button @click="upMonth()">▶</button>
  </fieldset>
</template>

<style lang="scss" scoped>
fieldset {
  display: flex;
  align-items: center;
  button {
    background-color: transparent;
    border: none;
    cursor: pointer;
    font-size: 1.8rem;
    padding: 0 10px;
    color: $gray;

    &:hover {
      color: $black;
    }
  }
}
</style>
