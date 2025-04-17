<script setup lang="ts">
type Props = {
  class?: string;
  name: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <p :class="class">#{{ props.name }}</p>
</template>

<style lang="scss" scoped>
p {
  background-color: $hover;
  border-radius: 5px;
  padding: 3px 5px;
  font-size: 0.8rem;
  color: $gray-hover;
}
</style>
