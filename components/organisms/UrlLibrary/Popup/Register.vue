<script lang="ts" setup>
import { initialData, validations, names } from '@/utils/forms/urlLibrary';

const form = useForm(initialData, validations, names);
const { getMasters } = useMaster();
const { addToast } = useToast();

const register = () => {
  if (form.allValidate()) return;

  fetcher('POST', '/url-libraries', { body: form.data })
    .then(async () => {
      // マスターデータを更新（新しいハッシュタグが作成された可能性があるため）
      await getMasters();
      addToast('URLを登録しました', 'success');
      useRouter().go(0);
    })
    .catch((err) => {
      if (err.status === 422) {
        form.setErrors(err._data.errors);
      } else {
        addToast('URLの登録に失敗しました', 'error');
      }
    });
};

const emits = defineEmits(['close']);
</script>

<template>
  <MoleculesPopupFrame @close="emits('close')">
    <div class="register-container">
      <h2 class="register-title">URL登録</h2>
      <OrganismsUrlLibraryPopupForm :form="form" />
      <AtomsBtn class="register-btn" size="lg" fullWidth @click="register()"
        >登録</AtomsBtn
      >
    </div>
  </MoleculesPopupFrame>
</template>

<style lang="scss" scoped>
.register-container {
  width: 100%;
  max-width: 700px;
  margin: 0 auto;
  background-color: $white;
  padding: 2rem;
  border-radius: 12px;
  text-align: left;

  .register-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: $text;
    margin-bottom: 1.5rem;
    text-align: center;
    border-bottom: 2px solid $primary;
    padding-bottom: 0.5rem;
  }

  .register-btn {
    margin-top: 2rem;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .register-container {
    max-width: 100%;
    padding: 1.5rem;

    .register-title {
      font-size: 1.25rem;
      margin-bottom: 1rem;
    }

    .register-btn {
      margin-top: 1.5rem;
    }
  }
}

@media (max-width: 480px) {
  .register-container {
    max-width: 100%;
    padding: 1rem;

    .register-title {
      font-size: 1.125rem;
    }
  }
}
</style>
