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
    .then(() => {
      emits('close');
      emits('updated');
    })
    .catch((err) => {
      if (err.status === 422) {
        form.setErrors(err._data.errors);
      }
    });
};

get();
</script>

<template>
  <MoleculesPopupFrame @close="emits('close')">
    <div class="edit-container">
      <OrganismsUrlLibraryPopupForm :form="form" />
      <AtomsBtn class="mx-auto mt-5" size="lg" fullWidth @click="edit()"
        >更新</AtomsBtn
      >
    </div>
  </MoleculesPopupFrame>
</template>

<style lang="scss" scoped>
.edit-container {
  display: block;
  margin: 0 auto;
  background-color: $white;
  padding: 30px 100px;
  border-radius: 10px;
  text-align: center;
}
</style>
