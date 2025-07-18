<script lang="ts" setup>
const form = useForm<{
  hashTagId: number | null;
  genreId: number | null;
  keyword: string;
}>({
  hashTagId: null,
  genreId: null,
  keyword: '',
});
const urlLibraries = ref<UrlLibrary[]>([]);
const showNoteId = ref<number | null>(null);
const showEditPopupId = ref<number | null>(null);
const showDeletePopupId = ref<number | null>(null);
const showRegisterPopup = ref(false);
const { addToast } = useToast();

const setUrlLibraries = async () => {
  const query = {
    hashTagId: form.data.hashTagId,
    genreId: form.data.genreId,
    keyword: form.data.keyword || undefined, // 空文字の場合はundefinedにする
  };

  await fetcher('GET', '/url-libraries', { query }).then((res) => {
    urlLibraries.value = res.data as UrlLibrary[];
  });
};

const deleteUrlLibrary = async (id: number) => {
  try {
    await fetcher('DELETE', `/url-libraries/${id}`);
    await setUrlLibraries();
    addToast('URLを削除しました', 'success');
    showDeletePopupId.value = null;
  } catch (err) {
    addToast('URLの削除に失敗しました', 'error');
  }
};

watch(
  () => form.data,
  () => {
    form.pushWithQuery('/');
    setUrlLibraries();
  },
  { deep: true },
);

const route = useRoute();
watch(
  () => route.query,
  () => {
    form.setQueryParam();
  },
  { immediate: true, deep: true },
);

await setUrlLibraries();
</script>

<template>
  <div class="url-list">
    <div :class="`left-block ${showNoteId ? '' : 'close-note'}`">
      <OrganismsUrlLibrarySearch class="search-block" :form="form" />
      <OrganismsUrlLibraryList
        :data="urlLibraries"
        @click-note="showNoteId = $event"
        @click-edit="showEditPopupId = $event"
        @click-delete="showDeletePopupId = $event"
        @add-url="showRegisterPopup = true"
      />
    </div>
    <div v-if="showNoteId" class="right-block">
      <OrganismsUrlLibraryNote :id="showNoteId" @close="showNoteId = null" />
    </div>
  </div>

  <OrganismsUrlLibraryPopupRegister
    v-if="showRegisterPopup"
    @close="
      showRegisterPopup = false;
      setUrlLibraries();
    "
  />

  <OrganismsUrlLibraryPopupEdit
    v-if="showEditPopupId"
    :id="showEditPopupId"
    @close="showEditPopupId = null"
    @updated="
      setUrlLibraries();
      showNoteId = null;
    "
  />

  <OrganismsConfirmPopup
    v-if="showDeletePopupId"
    title="URL削除"
    message="このURLを削除してもよろしいですか？削除後は元に戻すことができません。"
    confirmText="削除する"
    cancelText="キャンセル"
    variant="danger"
    @close="showDeletePopupId = null"
    @confirm="
      deleteUrlLibrary(showDeletePopupId);
      showNoteId = null;
      showDeletePopupId = null;
    "
  />
</template>

<style lang="scss" scoped>
.close-note {
  width: 100% !important;
}

.url-list {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  .left-block {
    width: 70%;
    display: inline-block;

    .search-block {
      margin-bottom: 20px;
    }
  }

  .right-block {
    width: 30%;
    height: 800px;
    display: inline-block;
  }
}
</style>
