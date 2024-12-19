<script lang="ts" setup>
const form = useForm<{
  hashTagId: number | null;
  genreId: number | null;
}>({
  hashTagId: null,
  genreId: null,
});
const urlLibraries = ref<UrlLibrary[]>([]);
const showNoteId = ref<number | null>(null);
const showEditPopupId = ref<number | null>(null);
const showDeletePopupId = ref<number | null>(null);

const setUrlLibraries = async () => {
  const query = {
    hashTagId: form.data.hashTagId,
    genreId: form.data.genreId,
  };

  await fetcher('GET', '/url-libraries', { query }).then((res) => {
    urlLibraries.value = res.data as UrlLibrary[];
  });
};

const deleteUrlLibrary = async (id: number) => {
  await fetcher('DELETE', `/url-libraries/${id}`).then(() => {
    setUrlLibraries();
    showDeletePopupId.value = null;
  });
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
      />
    </div>
    <div v-if="showNoteId" class="right-block">
      <OrganismsUrlLibraryNote :id="showNoteId" @close="showNoteId = null" />
    </div>
  </div>

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
    message="本当に削除しますか？"
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
      margin-left: 25px;
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
