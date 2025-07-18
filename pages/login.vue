<script lang="ts" setup>
definePageMeta({
  middleware: 'guest',
});

useHead({ title: 'ログイン' });
</script>

<template>
  <div class="login">
    <h1>URLibrary</h1>
    <OrganismsLogin />
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: block;
  align-items: center;
  width: 100%;
  height: 100%;

  h1 {
    color: $primary;
    display: block;
    text-align: center;
    font-size: 3rem;
    margin-bottom: 2rem;
    margin-top: 7rem;
    font-weight: bold;
  }
}
</style>
