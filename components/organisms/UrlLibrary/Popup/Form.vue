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
const handleTagCreate = (tagName: string) => {
  // バリデーション
  if (!tagName || tagName.trim().length === 0) {
    return;
  }

  const trimmedName = tagName.trim();

  // 既に存在するかチェック
  const existingTag = hashTags.value.find((tag) => tag.name === trimmedName);
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

  // 新しいタグ名として追加
  if (!props.form.data.hashTagNames.includes(trimmedName)) {
    props.form.update('hashTagNames', [
      ...props.form.data.hashTagNames,
      trimmedName,
    ]);
  }
};

// 表示用のハッシュタグオプション（既存 + 新規）
const displayHashTagOptions = computed(() => {
  const existing = hashTags.value;
  const newTags = props.form.data.hashTagNames.map((name, index) => ({
    id: `new-${index}`,
    name: name,
    isNew: true,
  }));
  return [...existing, ...newTags];
});

// 選択された値（既存ID + 新規タグ表示用ID）
const selectedHashTagValues = computed({
  get: () => {
    const existingIds = props.form.data.hashTagIds;
    const newTagIds = props.form.data.hashTagNames.map(
      (_, index) => `new-${index}`,
    );
    return [...existingIds, ...newTagIds];
  },
  set: (values: (number | string)[]) => {
    const existingIds: number[] = [];
    const newTagNames: string[] = [];

    if (Array.isArray(values)) {
      values.forEach((value) => {
        if (typeof value === 'string' && value.startsWith('new-')) {
          const index = parseInt(value.replace('new-', ''));
          if (props.form.data.hashTagNames[index]) {
            newTagNames.push(props.form.data.hashTagNames[index]);
          }
        } else if (typeof value === 'number') {
          existingIds.push(value);
        }
      });
    }

    props.form.update('hashTagIds', existingIds);
    props.form.update('hashTagNames', newTagNames);
  },
});
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
        :options="displayHashTagOptions"
        :value="selectedHashTagValues"
        :error-message="
          props.form.firstError('hashTagIds') ||
          props.form.firstError('hashTagNames')
        "
        :taggable="true"
        placeholder="タグを選択するか、新しいタグを入力してください"
        @change="selectedHashTagValues = $event"
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
