<script lang="ts" setup>
useHead({ title: 'ログイン' });

const email = ref('');
</script>

<template>
  <div class="login">
    <h1>URLibrary</h1>
    <div class="login-container">
      <p class="auth-error">ユーザ名またはパスワードが違います。</p>
      <form class="login-form">
        <AtomsInput type="email" :value="email" @change="email = $event" errorMessage="aaa" />
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 2rem;
    font: 'Inter';
  }
  .login-container {
    width: 300px;
    
    .login-form {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
