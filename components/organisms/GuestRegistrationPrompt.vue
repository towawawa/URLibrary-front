<script setup lang="ts">
import { initialData, validations, names } from '@/utils/forms/signup';

const { isGuest, guestStatus, convertGuestToRegular } = useAuth();
const { showSuccess, showError } = useToast();

const form = useForm(initialData, validations, names);
const showForm = ref(false);
const isLoading = ref(false);

const register = async () => {
  if (form.allValidate()) return;

  isLoading.value = true;
  try {
    await convertGuestToRegular({
      name: form.data.name,
      email: form.data.email,
      password: form.data.password,
      password_confirmation: form.data.password_confirmation,
    });

    showSuccess(
      '本登録が完了しました！保存したデータは全て引き継がれています。',
    );
  } catch (err: any) {
    if (err.status === 422) {
      form.setErrors(err._data.errors);
    } else {
      showError('登録に失敗しました。もう一度お試しください。');
    }
  } finally {
    isLoading.value = false;
  }
};

const getRemainingDaysText = () => {
  if (!guestStatus.value) return '';

  const days = guestStatus.value.days_remaining;
  if (days === null) return '';

  if (days <= 0) return '期限切れ';
  if (days === 1) return '残り1日';
  return `残り${days}日`;
};
</script>

<template>
  <div v-if="isGuest" class="guest-prompt">
    <!-- ゲストアカウント情報 -->
    <div class="guest-info">
      <div class="guest-badge">
        <i class="fas fa-user-clock"></i>
        <span>ゲストモード</span>
      </div>

      <div class="guest-details">
        <p class="guest-message">
          現在ゲストモードでご利用中です。<br />
          アカウント登録すると、保存したデータを永続的に利用できます。
        </p>

        <div v-if="guestStatus" class="expiry-info">
          <i class="fas fa-clock"></i>
          <span
            :class="{
              'text-warning':
                guestStatus.days_remaining && guestStatus.days_remaining <= 7,
            }"
          >
            {{ getRemainingDaysText() }}
          </span>
        </div>
      </div>

      <div v-if="!showForm" class="guest-actions">
        <AtomsBtn class="guest-btn" size="md" @click="showForm = true">
          <i class="fas fa-user-plus"></i>
          アカウント登録
        </AtomsBtn>
        <AtomsBtn
          size="md"
          style="background-color: gray; border-color: gray"
          class="guest-btn"
          @click="useRouter().push('/login')"
        >
          <i class="fas fa-sign-in-alt"></i>
          ログイン画面へ
        </AtomsBtn>
      </div>
    </div>

    <!-- 登録フォーム -->
    <div v-if="showForm" class="registration-form">
      <h3 class="form-title">
        <i class="fas fa-user-plus"></i>
        アカウント登録
      </h3>

      <div class="form-benefits">
        <h4>登録のメリット</h4>
        <ul>
          <li><i class="fas fa-check"></i>保存したデータが永続的に利用可能</li>
          <li><i class="fas fa-check"></i>すべての機能が無制限で利用可能</li>
        </ul>
      </div>

      <form @submit.prevent="register">
        <MoleculesInputField label="名前" :required="true">
          <AtomsInput
            :value="form.data.name"
            :error-message="form.firstError('name')"
            placeholder="お名前を入力してください"
            @change="form.update('name', $event)"
          />
        </MoleculesInputField>

        <MoleculesInputField label="メールアドレス" :required="true">
          <AtomsInput
            :value="form.data.email"
            :error-message="form.firstError('email')"
            placeholder="email@example.com"
            @change="form.update('email', $event)"
          />
        </MoleculesInputField>

        <MoleculesInputField label="パスワード" :required="true">
          <AtomsInput
            type="password"
            :value="form.data.password"
            :error-message="form.firstError('password')"
            placeholder="8文字以上で入力してください"
            @change="form.update('password', $event)"
          />
        </MoleculesInputField>

        <MoleculesInputField label="パスワード確認" :required="true">
          <AtomsInput
            type="password"
            :value="form.data.password_confirmation"
            :error-message="form.firstError('password_confirmation')"
            placeholder="同じパスワードを再入力してください"
            @change="form.update('password_confirmation', $event)"
          />
        </MoleculesInputField>

        <div class="form-actions">
          <button type="button" class="cancel-btn" @click="showForm = false">
            キャンセル
          </button>
          <button
            type="submit"
            class="submit-btn primary"
            :disabled="isLoading"
          >
            <i v-if="isLoading" class="fas fa-spinner fa-spin"></i>
            <i v-else class="fas fa-user-plus"></i>
            {{ isLoading ? '登録中...' : '登録する' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.guest-prompt {
  background: linear-gradient(
    135deg,
    rgba(90, 103, 216, 0.1),
    rgba(139, 92, 246, 0.1)
  );
  border: 1px solid rgba(90, 103, 216, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.guest-info {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.guest-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: rgba(90, 103, 216, 0.1);
  color: $primary;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 600;
  width: fit-content;
}

.guest-details {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.guest-message {
  font-size: 0.9rem;
  line-height: 1.6;
  margin: 0;
}

.expiry-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  color: $text-muted;

  .text-warning {
    color: $warning;
    font-weight: 600;
  }
}

.guest-actions {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.guest-btn {
  min-width: 120px;
  font-size: 0.95rem;
  height: 2.5rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  border-radius: 6px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.2s;
}

.registration-form {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  margin-top: 1rem;
}

.form-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: $primary;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 0 1.5rem 0;
}

.form-benefits {
  background: rgba(72, 187, 120, 0.05);
  border-left: 4px solid #48bb78;
  padding: 1rem;
  margin-bottom: 2rem;
  border-radius: 0 8px 8px 0;

  h4 {
    color: #48bb78;
    font-size: 0.875rem;
    font-weight: 600;
    margin: 0 0 0.75rem 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    li {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-size: 0.875rem;

      i {
        color: #48bb78;
        font-size: 0.75rem;
      }
    }
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.cancel-btn,
.submit-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  &:hover {
  }
}

.submit-btn {
  &.primary {
    background: $primary;
    color: white;

    &:hover:not(:disabled) {
      background: $primary-hover;
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .guest-prompt {
    padding: 1rem;
  }

  .registration-form {
    padding: 1.5rem;
  }

  .form-actions {
    flex-direction: column;

    .cancel-btn,
    .submit-btn {
      width: 100%;
      justify-content: center;
    }
  }
}
</style>
