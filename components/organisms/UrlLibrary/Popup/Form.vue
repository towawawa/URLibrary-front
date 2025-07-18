<script lang="ts" setup>
import type { Form } from '@/utils/forms/urlLibrary';

type Props = {
  form: ReturnType<typeof useForm<Form>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { hashTags, genres, getMasters } = useMaster();

// 新しいハッシュタグが作成された時の処理
const handleTagCreate = async (tagName: string) => {
  // 既に存在するかチェック
  const existingTag = hashTags.value.find((tag) => tag.name === tagName);
  if (existingTag) {
    // 既存のタグがあれば選択状態に追加
    if (!props.form.data.hashTagIds.includes(existingTag.id)) {
      props.form.update('hashTagIds', [
        ...props.form.data.hashTagIds,
        existingTag.id,
      ]);
    }
    return;
  }

  // 新しいタグをAPIで登録
  await fetcher('POST', '/hash-tags', { body: tagName });

  // マスターデータを取得し直す
  await getMasters();

  // 新しく作成されたタグを見つけてフォームに追加
  const newTag = hashTags.value.find((tag) => tag.name === tagName);

  if (newTag) {
    props.form.update('hashTagIds', [...props.form.data.hashTagIds, newTag.id]);
  }
};
</script>

<template>
  <form class="url-form">
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
        label-prop="name"
        value-prop="id"
        placeholder="タグを選択するか、新しいタグを入力してください"
        @change="props.form.update('hashTagIds', $event)"
        @tag:create="handleTagCreate"
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
.url-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
