<script lang="ts" setup>
import type { Form } from '@/utils/forms/genre';

type Props = {
  form: ReturnType<typeof useForm<Form>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <form class="genre-form">
    <MoleculesInputField label="ジャンル名" :required="true">
      <AtomsInput
        :value="props.form.data.name"
        :error-message="props.form.firstError('name')"
        @change="props.form.update('name', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="アイコン画像">
      <AtomsFileInput
        accept="image/*"
        :error-message="props.form.firstError('image')"
        @change="props.form.update('image', $event)"
      />
    </MoleculesInputField>
  </form>
</template>

<style lang="scss" scoped>
.genre-form {
  display: flex;
  flex-direction: column;
}
</style> 