<script lang="ts" setup>
type Props = {
  class?: string;
  data: UrlLibrary;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <a class="tag" :key="props.data.id" :href="props.data.url" target="_blank">
    <li>
      {{ props.data.title }}
    </li>
  </a>
</template>

<style lang="scss" scoped>
.tag {
  display: inline-block;
  padding: 4px 8px;
  background-color: $light-primary;
  border-left: 5px solid $primary;
  color: $dark-primary;
  font-size: 0.8rem;
  text-decoration: none;
  cursor: pointer;
  text-align: left;
  height: 48px;
  width: 180px;
  overflow: hidden;
  white-space: normal;
  word-wrap: break-word;

  &:hover {
    opacity: 0.8;
  }
}
</style>
