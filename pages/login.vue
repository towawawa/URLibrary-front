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
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;

  h1 {
    color: $primary;
    text-align: center;
    font-size: 3rem;
    margin-bottom: 3rem;
    font-weight: bold;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .login {
    h1 {
      font-size: 2.5rem;
      margin-bottom: 2rem;
    }
  }
}

@media (max-width: 480px) {
  .login {
    h1 {
      font-size: 2rem;
      margin-bottom: 1.5rem;
    }
  }
}
</style>
