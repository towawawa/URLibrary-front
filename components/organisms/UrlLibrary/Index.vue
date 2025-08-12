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

  try {
    const res = await fetcher('GET', '/url-libraries', { query });
    urlLibraries.value = res.data as UrlLibrary[];
  } catch (error) {
    console.error('URL一覧取得エラー:', error);
    urlLibraries.value = [];
  }
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
      <div class="content-with-ads">
        <div class="content-area">
          <OrganismsUrlLibraryList
            :data="urlLibraries"
            @click-note="showNoteId = $event"
            @click-edit="showEditPopupId = $event"
            @click-delete="showDeletePopupId = $event"
            @add-url="showRegisterPopup = true"
          />
        </div>
        <aside class="ad-area">
          <AtomsAdSense
            ad-slot="2163232479"
            ad-format="auto"
            style="display: block; width: 100%; min-height: 250px"
          />
        </aside>
      </div>
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

    .content-with-ads {
      display: grid;
      grid-template-columns: 1fr 300px; // コンテンツと右広告
      gap: 16px;

      .content-area {
        min-width: 0; // 折り返し対策
      }

      .ad-area {
        position: sticky;
        top: 100px; // ヘッダー分の余白
        height: fit-content;
      }
    }
  }

  .right-block {
    width: 30%;
    height: 800px;
    display: inline-block;
  }
}
</style>
