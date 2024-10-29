<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/login';

// 認証エラーが表示されるかどうか
const showLoginError = ref(false);
const form = useForm(initialData, validations, names);

const login = () => {
  if (form.allValidate()) return;

  fetcher('POST', '/login', { body: form.data })
    .then((res) => {
      localStorage.setItem('token', res.token);
      useRouter().push({ path: '/' });
    })
    .catch((err) => {
      if (err.data.code === 401) {
        showLoginError.value = true;
      }
    });
};
</script>

<template>
  <div class="login-container" @keyup.enter="login()">
    <p v-if="showLoginError" class="auth-error">
      <img src="@/assets/images/error-icon.svg" alt="エラー" />
      ユーザ名またはパスワードが違います。
    </p>
    <OrganismsLoginForm :form="form" />
    <AtomsBtn class="mx-auto mt-5" @click="login()">ログイン</AtomsBtn>
    <AtomsLinkBtn class="mx-auto mt-2" to="/signup" color="gray">
      新規登録
    </AtomsLinkBtn>
    <AtomsLinkBtn class="mx-auto mt-5" to="/password-reset" color="text">
      パスワードをお忘れの方はこちら
    </AtomsLinkBtn>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: block;
  margin: 0 auto;
  width: 600px;
  background-color: $white;
  padding: 30px 100px;
  border-radius: 10px;
  text-align: center;

  .auth-error {
    img {
      display: block;
      width: 20px;
      height: 20px;
      margin: auto 10px auto 0;
    }
    display: flex;
    border: $error 1px solid;
    background-color: $error-background;
    color: $white;
    text-align: center;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .login-form {
    display: flex;
    flex-direction: column;
  }
}
</style>
