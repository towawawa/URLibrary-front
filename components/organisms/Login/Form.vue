<script lang="ts" setup>
import type { Form } from '@/utils/forms/login';

type Props = {
  form: ReturnType<typeof useForm<Form>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <form class="login-form">
    <MoleculesInputField label="メールアドレス" :required="true">
      <AtomsInput
        type="email"
        :value="props.form.data.email"
        :error-message="props.form.firstError('email')"
        @change="props.form.update('email', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="パスワード" :required="true">
      <AtomsInput
        type="password"
        :value="props.form.data.password"
        :error-message="props.form.firstError('password')"
        @change="props.form.update('password', $event)"
      />
    </MoleculesInputField>
  </form>
</template>

<style lang="scss" scoped>
.login-form {
  display: flex;
  flex-direction: column;
}
</style>
