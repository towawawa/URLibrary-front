<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/userProfile';

definePageMeta({
  middleware: 'auth',
});

// ページタイトル設定
useHead({
  title: 'プロフィール設定',
});

// 成功メッセージ表示用
const showSuccessMessage = ref(false);
const showUpdateError = ref(false);
const isLoading = ref(false);

const form = useForm(initialData, validations, names);

// 現在のユーザー情報を取得
const setCurrentUserData = async () => {
  try {
    const res = await fetcher('GET', '/me');
    const userData = res.data;
    form.update('name', userData.name);
    form.update('email', userData.email);
  } catch (err) {
    console.error('Failed to fetch user data:', err);
  }
};

const updateProfile = async () => {
  if (form.allValidate()) return;

  isLoading.value = true;

  const requestData: any = {
    name: form.data.name,
    email: form.data.email,
  };

  // パスワードが入力されている場合のみ送信
  if (form.data.password) {
    requestData.password = form.data.password;
    requestData.password_confirmation = form.data.password_confirmation;
  }

  try {
    await fetcher('PUT', '/user', {
      body: requestData,
    });

    showSuccessMessage.value = true;
    // パスワードフィールドをクリア
    form.update('password', '');
    form.update('password_confirmation', '');

    // 3秒後にメッセージを非表示
    setTimeout(() => {
      showSuccessMessage.value = false;
    }, 3000);
  } catch (err: any) {
    if (err.status === 422) {
      form.setErrors(err._data.errors);
    } else {
      showUpdateError.value = true;
      setTimeout(() => {
        showUpdateError.value = false;
      }, 3000);
    }
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  useRouter().push('/');
};

// ページ読み込み時にユーザー情報を取得
await setCurrentUserData();
</script>

<template>
  <div class="profile-page">
    <div class="profile-container">
      <div class="profile-header">
        <h1>
          <i class="fas fa-user-cog"></i>
          プロフィール設定
        </h1>
      </div>

      <!-- 成功メッセージ -->
      <Transition name="message-fade">
        <div v-if="showSuccessMessage" class="success-message">
          <i class="fas fa-check-circle"></i>
          プロフィールを更新しました。
        </div>
      </Transition>

      <!-- エラーメッセージ -->
      <Transition name="message-fade">
        <div v-if="showUpdateError" class="error-message">
          <i class="fas fa-exclamation-circle"></i>
          更新に失敗しました。もう一度お試しください。
        </div>
      </Transition>

      <form class="profile-form" @submit.prevent="updateProfile()">
        <div class="form-section">
          <h3>基本情報</h3>

          <MoleculesInputField label="お名前" :required="true">
            <AtomsInput
              :value="form.data.name"
              :error-message="form.firstError('name')"
              placeholder="お名前を入力"
              @change="form.update('name', $event)"
            />
          </MoleculesInputField>

          <MoleculesInputField label="メールアドレス" :required="true">
            <AtomsInput
              type="email"
              :value="form.data.email"
              :error-message="form.firstError('email')"
              placeholder="メールアドレスを入力"
              @change="form.update('email', $event)"
            />
          </MoleculesInputField>
        </div>

        <div class="form-section password-section">
          <h3>パスワード変更</h3>
          <p class="section-note">
            パスワードを変更する場合のみ入力してください
          </p>

          <MoleculesInputField label="新しいパスワード">
            <AtomsInput
              type="password"
              :value="form.data.password"
              :error-message="form.firstError('password')"
              placeholder="新しいパスワード（8文字以上）"
              @change="form.update('password', $event)"
            />
          </MoleculesInputField>

          <MoleculesInputField label="パスワード確認">
            <AtomsInput
              type="password"
              :value="form.data.password_confirmation"
              :error-message="form.firstError('password_confirmation')"
              placeholder="パスワードを再入力"
              @change="form.update('password_confirmation', $event)"
            />
          </MoleculesInputField>
        </div>

        <div class="button-area">
          <AtomsBtn
            type="submit"
            size="lg"
            :loading="isLoading"
            :disabled="isLoading"
            class="update-btn"
          >
            <i v-if="!isLoading" class="fas fa-save"></i>
            更新
          </AtomsBtn>

          <AtomsBtn
            variant="secondary"
            size="lg"
            type="button"
            @click="goBack"
            :disabled="isLoading"
          >
            <i class="fas fa-arrow-left"></i>
            戻る
          </AtomsBtn>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.profile-page {
  min-height: 100vh;
  background: $background;
  padding: 2rem 1rem;
  display: flex;
  justify-content: center;
  align-items: flex-start;
}

.profile-container {
  background: $white;
  border-radius: 12px;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  width: 100%;
  max-width: 600px;
  overflow: hidden;

  .profile-header {
    background: linear-gradient(135deg, $primary-light 0%, $gray-50 100%);
    padding: 2rem;
    text-align: center;
    border-bottom: 1px solid $border;

    h1 {
      color: $primary-dark;
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.75rem;

      i {
        font-size: 1.25rem;
      }
    }
  }

  .success-message,
  .error-message {
    display: flex;
    align-items: center;
    padding: 1rem 2rem;
    margin: 0;
    font-weight: 500;

    i {
      margin-right: 0.75rem;
      font-size: 1rem;
    }
  }

  .success-message {
    background: $success-light;
    color: $success;
    border-bottom: 1px solid rgba(16, 185, 129, 0.2);
  }

  .error-message {
    background: $error-light;
    color: $error;
    border-bottom: 1px solid rgba(239, 68, 68, 0.2);
  }

  .profile-form {
    padding: 2rem;

    .form-section {
      margin-bottom: 2rem;

      &:last-child {
        margin-bottom: 0;
      }

      h3 {
        color: $text;
        margin-bottom: 1rem;
        font-size: 1.1rem;
        font-weight: 600;
        display: flex;
        align-items: center;
        gap: 0.5rem;

        &::before {
          content: '';
          width: 3px;
          height: 1.2rem;
          background: $primary;
          border-radius: 1.5px;
        }
      }

      .section-note {
        color: $text-muted;
        font-size: 0.85rem;
        margin-bottom: 1.5rem;
        padding: 0.75rem;
        background: $gray-50;
        border-radius: 6px;
        border-left: 3px solid $warning;
      }

      &.password-section {
        padding-top: 2rem;
        border-top: 1px solid $border;
      }
    }

    .button-area {
      display: flex;
      gap: 1rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid $border;

      .update-btn {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      button:last-child {
        flex: 0 0 auto;
        min-width: 120px;
      }
    }
  }
}

// メッセージのトランジション
.message-fade-enter-active,
.message-fade-leave-active {
  transition: all 0.3s ease;
}

.message-fade-enter-from,
.message-fade-leave-to {
  opacity: 0;
  transform: translateY(-1rem);
}

// レスポンシブ対応
@media (max-width: 768px) {
  .profile-page {
    padding: 1rem 0.75rem;
  }

  .profile-container {
    .profile-header {
      padding: 1.5rem;

      h1 {
        font-size: 1.25rem;
        flex-direction: column;
        gap: 0.5rem;
      }
    }

    .profile-form {
      padding: 1.5rem;

      .form-section h3 {
        font-size: 1rem;
      }

      .button-area {
        flex-direction: column;

        button:last-child {
          min-width: auto;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .profile-page {
    padding: 0.75rem 0.5rem;
  }

  .profile-container {
    .profile-header {
      padding: 1rem;

      h1 {
        font-size: 1.125rem;
      }
    }

    .profile-form {
      padding: 1rem;

      .form-section {
        margin-bottom: 1.5rem;

        &.password-section {
          padding-top: 1.5rem;
        }
      }

      .button-area {
        margin-top: 1.5rem;
        padding-top: 1.5rem;
      }
    }
  }
}
</style>
