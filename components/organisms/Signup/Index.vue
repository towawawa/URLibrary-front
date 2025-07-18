<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/signup';

const form = useForm(initialData, validations, names);
const { showError, showSuccess, showInfo } = useToast();
const router = useRouter();

const signup = async () => {
  if (form.allValidate()) return;

  try {
    const response = await fetcher('POST', '/register', { body: form.data });
    localStorage.setItem('token', response.token);
    showSuccess('アカウントを作成しました！');
    router.push({ path: '/' });
  } catch (err: any) {
    if (err.status === 422) {
      form.setErrors(err._data.errors);
    } else {
      showError('登録に失敗しました。もう一度お試しください。');
    }
  }
};

const handleGoogleSignup = () => {
  // TODO: Google OAuth2 の実装
  // 現在は開発中メッセージを表示
  showInfo('Google SSO機能は開発中です。');
};
</script>

<template>
  <div class="signup-container" @keyup.enter="signup()">
    <h2 class="signup-title">
      <i class="fas fa-user-plus"></i>
      アカウント作成
    </h2>

    <OrganismsSignupForm :form="form" />

    <AtomsBtn class="signup-btn" size="lg" fullWidth @click="signup()">
      <i class="fas fa-user-plus"></i>
      アカウントを作成
    </AtomsBtn>

    <!-- 区切り線 -->
    <div class="divider">
      <span>または</span>
    </div>

    <!-- Google SSO ボタン -->
    <AtomsGoogleBtn
      class="google-btn"
      size="lg"
      fullWidth
      @click="handleGoogleSignup"
    >
      Googleでアカウント作成
    </AtomsGoogleBtn>

    <div class="auth-links">
      <span class="login-text">既にアカウントをお持ちですか？</span>
      <AtomsLinkBtn to="/login" color="gray" class="login-link">
        <i class="fas fa-sign-in-alt"></i>
        ログイン
      </AtomsLinkBtn>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.signup-container {
  display: block;
  margin: 0 auto;
  width: 700px;
  background-color: $white;
  padding: 40px 120px;
  border-radius: 10px;
  text-align: center;

  .signup-title {
    color: $primary;
    margin: 0 0 2rem 0;
    font-size: 1.8rem;
    font-weight: 700;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;

    i {
      font-size: 1.6rem;
    }
  }

  .signup-btn {
    margin: 2rem auto 1.5rem;

    &:not(:disabled):hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(116, 160, 67, 0.25);
    }
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
    margin: 0 auto 2rem;
  }

  .auth-links {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    margin-top: 2rem;

    .login-text {
      color: $text-muted;
      font-size: 0.9rem;
    }

    .login-link {
      width: 100%;
      text-align: center;
      padding: 0.875rem 1rem;
      border-radius: 8px;
      background: $gray-100;
      color: $text;
      text-decoration: none;
      transition: all 0.2s ease;
      font-weight: 600;
      font-size: 0.95rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;

      i {
        font-size: 0.9rem;
      }

      &:hover {
        background: $gray-200;
        transform: translateY(-1px);
      }

      &:active {
        transform: translateY(0);
      }
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .signup-container {
    width: 600px;
    padding: 30px 80px;

    .signup-title {
      font-size: 1.6rem;

      i {
        font-size: 1.4rem;
      }
    }
  }
}

@media (max-width: 480px) {
  .signup-container {
    width: 90%;
    padding: 20px 30px;

    .signup-title {
      font-size: 1.4rem;
      flex-direction: column;
      gap: 0.5rem;

      i {
        font-size: 1.2rem;
      }
    }

    .signup-btn {
      margin: 1.5rem auto 1rem;
    }

    .divider {
      margin: 1.5rem 0 1rem;
    }

    .google-btn {
      margin: 0 auto 1.5rem;
    }

    .auth-links {
      margin-top: 1.5rem;

      .login-link {
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
