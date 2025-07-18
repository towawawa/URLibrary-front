<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/urlLibrary';

type Props = {
  id: number;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
const emits = defineEmits(['close', 'updated']);

const form = useForm(initialData, validations, names);
const { getMasters } = useMaster();
const { addToast } = useToast();

const get = () => {
  fetcher('GET', `/url-libraries/${props.id}`).then((res) => {
    const data = res.data as UrlLibrary;
    const hashTagIds = data.hashTags.map((hashTag) => hashTag.id);
    const genreId = data.genre.id;

    form.setValues({
      ...data,
      hashTagIds,
      genreId,
    });
  });
};

const edit = () => {
  if (form.allValidate()) return;

  fetcher('PUT', `/url-libraries/${props.id}`, { body: form.data })
    .then(async () => {
      // マスターデータを更新（新しいハッシュタグが作成された可能性があるため）
      await getMasters();
      addToast('URLを更新しました', 'success');
      emits('close');
      emits('updated');
    })
    .catch((err) => {
      if (err.status === 422) {
        form.setErrors(err._data.errors);
      } else {
        addToast('URLの更新に失敗しました', 'error');
      }
    });
};

get();
</script>

<template>
  <MoleculesPopupFrame @close="emits('close')">
    <div class="edit-container">
      <h2 class="edit-title">URL編集</h2>
      <OrganismsUrlLibraryPopupForm :form="form" />
      <AtomsBtn class="edit-btn" size="lg" fullWidth @click="edit()"
        >更新</AtomsBtn
      >
    </div>
  </MoleculesPopupFrame>
</template>

<style lang="scss" scoped>
.edit-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  background-color: $white;
  padding: 2rem;
  border-radius: 12px;
  text-align: left;

  .edit-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: $text;
    margin-bottom: 1.5rem;
    text-align: center;
    border-bottom: 2px solid $primary;
    padding-bottom: 0.5rem;
  }

  .edit-btn {
    margin-top: 2rem;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .edit-container {
    max-width: 100%;
    padding: 1.5rem;

    .edit-title {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .edit-btn {
      margin-top: 1.5rem;
    }
  }
}

@media (max-width: 480px) {
  .edit-container {
    max-width: 100%;
    padding: 1rem;

    .edit-title {
      font-size: 1.125rem;
    }
  }
}
</style>
