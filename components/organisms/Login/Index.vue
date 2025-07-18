<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/login';

const form = useForm(initialData, validations, names);
const { login: authLogin } = useAuth();
const { showError, showInfo } = useToast();
const router = useRouter();

const login = async () => {
  if (form.allValidate()) return;

  try {
    await authLogin(form.data);
    router.push({ path: '/' });
  } catch (err: any) {
    if (err.status === 401) {
      showError('ユーザ名またはパスワードが違います。');
    } else if (err.status === 422) {
      form.setErrors(err._data.errors);
    } else {
      showError('ログインに失敗しました。もう一度お試しください。');
    }
  }
};

const handleGoogleLogin = () => {
  // TODO: Google OAuth2 の実装
  // 現在は開発中メッセージを表示
  showInfo('Google SSO機能は開発中です。');
};
</script>

<template>
  <div class="login-container" @keyup.enter="login()">
    <OrganismsLoginForm :form="form" />
    <AtomsBtn class="mx-auto mt-5" size="lg" fullWidth @click="login()"
      >ログイン</AtomsBtn
    >

    <!-- 区切り線 -->
    <div class="divider">
      <span>または</span>
    </div>

    <!-- Google SSO ボタン -->
    <AtomsGoogleBtn
      class="google-btn"
      size="lg"
      fullWidth
      @click="handleGoogleLogin"
    >
      Googleでログイン
    </AtomsGoogleBtn>

    <div class="auth-links">
      <AtomsLinkBtn to="/signup" color="gray" class="signup-link">
        <i class="fas fa-user-plus"></i>
        アカウント作成
      </AtomsLinkBtn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login-container {
  display: flex;
  flex-direction: column;
  margin: 0 auto;
  max-width: 450px;
  width: 100%;
  background-color: $white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);

  .auth-error {
    i {
      font-size: 1.2rem;
      margin-right: 10px;
      color: $white;
    }
    display: flex;
    align-items: center;
    border: $error 1px solid;
    background-color: $error-background;
    color: $white;
    text-align: center;
    border-radius: 10px;
    padding: 10px;
    margin-bottom: 10px;
  }

  .divider {
    position: relative;
    text-align: center;
    margin: 2rem 0 1.5rem;

    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      right: 0;
      height: 1px;
      background: $border;
    }

    span {
      background: $white;
      color: $text-muted;
      padding: 0 1rem;
      font-size: 0.875rem;
    }
  }

  .google-btn {
    margin-bottom: 1rem;
  }

  .auth-links {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
    margin-top: 1rem;

    .signup-link {
      width: 100%;
      text-align: center;
      padding: 0.875rem 1rem;
      border-radius: 8px;
      color: $white;
      text-decoration: none;
      transition: all 0.2s ease;
      font-weight: 600;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      box-shadow: 0 2px 4px rgba(116, 160, 67, 0.2);

      i {
        font-size: 0.9rem;
      }

      &:hover {
        background: linear-gradient(
          135deg,
          $primary-hover 0%,
          darken($primary-hover, 5%) 100%
        );
        transform: translateY(-1px);
        box-shadow: 0 4px 8px rgba(116, 160, 67, 0.3);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .login-container {
    max-width: 400px;
    padding: 1.5rem;
    margin: 0 auto;
  }
}

@media (max-width: 480px) {
  .login-container {
    max-width: none;
    margin: 0 auto;
    padding: 1rem;

    .auth-links {
      .signup-link {
        padding: 0.75rem 0.875rem;
        font-size: 0.9rem;

        i {
          font-size: 0.85rem;
        }
      }
    }
  }
}
</style>
