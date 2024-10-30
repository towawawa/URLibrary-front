<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/urlLibrary';

// 認証エラーが表示されるかどうか
const showLoginError = ref(false);
const form = useForm(initialData, validations, names);

const register = () => {
  if (form.allValidate()) return;

  fetcher('POST', '/url-libraries', { body: form.data })
    .then(() => {
      useRouter().go(0);
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
    <div class="register-container">
      <OrganismsUrlLibraryPopupForm :form="form" />
      <AtomsBtn class="mx-auto mt-5" @click="register()">登録</AtomsBtn>
    </div>
  </MoleculesPopupFrame>
</template>

<style lang="scss" scoped>
.register-container {
  display: block;
  margin: 0 auto;
  background-color: $white;
  padding: 30px 100px;
  border-radius: 10px;
  text-align: center;
}
</style>
