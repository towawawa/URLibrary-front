<script setup lang="ts">
definePageMeta({
  middleware: 'guest',
});
</script>

<template>
  <div class="signup">
    <OrganismsSignup />
  </div>
</template>

<style lang="scss" scoped>
.signup {
  display: block;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>
