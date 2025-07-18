<script lang="ts" setup>
import Index from '@/components/organisms/Calendar/Index.vue';

definePageMeta({
  middleware: 'auth',
});
</script>

<template>
  <div class="calendar-content">
    <Index />
  </div>
</template>

<style lang="scss">
.calendar-content {
  margin: 20px;
}
</style>
