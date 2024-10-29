<script lang="ts" setup>
type Props = {
  class?: string;
  data: UrlLibrary;
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <li class="tag">
    <a
      :key="props.data.id"
      :href="props.data.url"
      >
      {{ props.data.title }}
    </a>
  </li>
</template>

<style lang="scss" scoped>

</style>
