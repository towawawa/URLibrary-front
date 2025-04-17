<script lang="ts" setup>
import type { UrlLibrary } from '@/types/api/urlLibrary';

type Props = {
  class?: string;
  data: UrlLibrary[];
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const emits = defineEmits<{
  (event: 'click-note', value: number): void;
  (event: 'click-edit', value: number): void;
  (event: 'click-delete', value: number): void;
}>();
</script>

<template>
  <ul>
    <OrganismsUrlLibraryRow
      v-for="item in props.data"
      :key="item.id"
      :data="item"
      @click-note="emits('click-note', item.id)"
      @click-edit="emits('click-edit', item.id)"
      @click-delete="emits('click-delete', item.id)"
    />
  </ul>
</template>

<style lang="scss" scoped>
ul {
}
</style>
