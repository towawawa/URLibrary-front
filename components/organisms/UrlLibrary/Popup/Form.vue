<script lang="ts" setup>
import type { Form } from '@/utils/forms/urlLibrary';

type Props = {
  form: ReturnType<typeof useForm<Form>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { hashTags, genres } = useMaster();
</script>

<template>
  <form class="login-form">
    <MoleculesInputField label="タイトル" :required="true">
      <AtomsInput
        :value="props.form.data.title"
        :error-message="props.form.firstError('title')"
        @change="props.form.update('title', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="URL" :required="true">
      <AtomsInput
        :value="props.form.data.url"
        :error-message="props.form.firstError('url')"
        @change="props.form.update('url', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="ジャンル">
      <AtomsPulldown
        :options="genres"
        :value="props.form.data.genreId"
        :error-message="props.form.firstError('genreId')"
        @change="props.form.update('genreId', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="タグ">
      <AtomsMultiPulldown
        :options="hashTags"
        :value="props.form.data.hashTagIds"
        :error-message="props.form.firstError('hashTagIds')"
        @change="props.form.update('hashTagIds', $event)"
      />
    </MoleculesInputField>
        <MoleculesInputField label="メモ">
      <AtomsTextarea
        :value="props.form.data.note"
        :error-message="props.form.firstError('note')"
        @change="props.form.update('note', $event)"
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
