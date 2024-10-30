<script setup lang="ts">
const route = useRoute();
</script>

<template>
  <OrganismsHeader v-if="route.path !== '/login'" />
  <main class="main-content">
    <OrganismsSideMenu v-if="route.path !== '/login'" />
    <content>
      <slot></slot>
    </content>
  </main>
</template>

<style lang="scss" scoped>
.main-content {
  display: flex;
  content {
    width: 100%;
  }
}
</style>
