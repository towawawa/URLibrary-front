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
  <a
    class="calendar-tag"
    :key="props.data.id"
    :href="props.data.url"
    target="_blank"
  >
    {{ props.data.title }}
  </a>
</template>

<style lang="scss" scoped>
.calendar-tag {
  display: block;
  padding: 0.375rem 0.5rem;
  background: $primary-light;
  border-left: 3px solid $primary;
  color: $primary-dark;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  text-align: left;
  margin-bottom: 0.25rem;
  border-radius: 0 4px 4px 0;
  transition: all 0.2s ease;

  // テキストの省略表示
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  &:hover {
    background: $primary;
    color: $white;
    transform: translateX(2px);
  }

  &:last-child {
    margin-bottom: 0;
  }
}
</style>
