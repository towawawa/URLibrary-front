<script lang="ts" setup>
import type { Form } from '@/utils/forms/signup';

type Props = {
  form: ReturnType<typeof useForm<Form>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <form class="signup-form">
    <MoleculesInputField label="お名前" :required="true">
      <AtomsInput
        :value="props.form.data.name"
        :error-message="props.form.firstError('name')"
        placeholder="山田太郎"
        size="lg"
        @change="props.form.update('name', $event)"
      />
    </MoleculesInputField>

    <MoleculesInputField label="メールアドレス" :required="true">
      <AtomsInput
        type="email"
        :value="props.form.data.email"
        :error-message="props.form.firstError('email')"
        placeholder="example@email.com"
        size="lg"
        @change="props.form.update('email', $event)"
      />
    </MoleculesInputField>

    <MoleculesInputField label="パスワード" :required="true">
      <AtomsInput
        type="password"
        :value="props.form.data.password"
        :error-message="props.form.firstError('password')"
        placeholder="8文字以上で入力してください"
        size="lg"
        @change="props.form.update('password', $event)"
      />
    </MoleculesInputField>

    <MoleculesInputField label="パスワード確認" :required="true">
      <AtomsInput
        type="password"
        :value="props.form.data.password_confirmation"
        :error-message="props.form.firstError('password_confirmation')"
        placeholder="パスワードを再入力してください"
        size="lg"
        @change="props.form.update('password_confirmation', $event)"
      />
    </MoleculesInputField>
  </form>
</template>

<style lang="scss" scoped>
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin: 2rem 0;

  :deep(.input-wrapper) {
    margin-bottom: 0;
  }

  :deep(fieldset) {
    margin-bottom: 0;

    legend {
      font-weight: 600;
      color: $text;
      margin-bottom: 0.5rem;
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .signup-form {
    gap: 1.25rem;
    margin: 1.75rem 0;
  }
}

@media (max-width: 480px) {
  .signup-form {
    gap: 1rem;
    margin: 1.5rem 0;
  }
}
</style>
