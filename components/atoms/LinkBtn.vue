<script setup lang="ts">
import type { RouteNamedMap } from 'vue-router/auto-routes';

type PagePath = RouteNamedMap[keyof RouteNamedMap]['path'];

type Props = {
  class?: string;
  color: 'primary' | 'gray' | 'text';
  to: PagePath;
};

const props = withDefaults(defineProps<Props>(), {
  color: 'primary',
  class: '',
});
</script>

<template>
  <nuxt-link :class="[props.class, props.color]" :to="props.to">
    <slot></slot>
  </nuxt-link>
</template>

<style lang="scss" scoped>
a {
  &.text {
    color: $url-text;
    text-align: center;
    font-size: 1rem;
    display: inline-block;
    border-bottom: 1px solid $url-text;
  }

  &.primary,
  &.gray {
    display: block;
    height: 45px;
    width: 200px;
    border: none;
    border-radius: 20px;
    color: white;
    cursor: pointer;
    transition: background-color 0.3s;
    font-size: 0.9rem;
    text-align: center;
    line-height: 45px;
    &.primary {
      background-color: $primary;
      &:hover {
        background-color: $primary-hover;
      }
    }
    &.gray {
      background-color: $gray;
      &:hover {
        background-color: $gray-hover;
      }
    }
  }
}
</style>
