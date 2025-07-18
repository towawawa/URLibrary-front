<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/genre';

const form = useForm(initialData, validations, names);

const addGenre = () => {
  if (form.allValidate()) return;

  // FormDataを作成して画像ファイルを送信
  const formData = new FormData();
  formData.append('name', form.data.name);
  if (form.data.image) {
    formData.append('image', form.data.image);
  }

  fetcher('POST', '/genres', {
    body: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
    .then(() => {
      useRouter().go(0); // ページリロードでジャンル一覧を更新
    })
    .catch((err) => {
      if (err.status === 422) {
        form.setErrors(err._data.errors);
      }
    });
};

const emits = defineEmits(['close']);
</script>

<template>
  <MoleculesPopupFrame @close="emits('close')">
    <div class="add-genre-container">
      <h2>ジャンルを追加</h2>
      <OrganismsGenreForm :form="form" />
      <AtomsBtn class="mx-auto mt-5" size="lg" fullWidth @click="addGenre()"
        >追加</AtomsBtn
      >
    </div>
  </MoleculesPopupFrame>
</template>

<style lang="scss" scoped>
.add-genre-container {
  display: block;
  margin: 0 auto;
  background-color: $white;
  padding: 30px 100px;
  border-radius: 10px;
  text-align: center;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 20px;
    color: $primary;
  }
}
</style>
