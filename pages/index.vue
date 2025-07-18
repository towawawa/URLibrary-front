<script lang="ts" setup>
import Index from '@/components/organisms/UrlLibrary/Index.vue';

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <div class="top-content">
    <Index />
  </div>
</template>

<style lang="scss"></style>
