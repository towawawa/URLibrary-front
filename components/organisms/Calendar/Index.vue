<script lang="ts" setup>
// 現在の年月を取得
const { $dayjs } = useNuxtApp();
const ym = $dayjs().format('YYYY-MM');

const form = useForm<{
  ym: string;
  hashTagId: number | null;
  genreId: number | null;
}>({
  ym,
  hashTagId: null,
  genreId: null,
});
const urlLibraries = ref<UrlLibrary[]>([]);

const setUrlLibraries = async () => {
  const query = {
    hashTagId: form.data.hashTagId,
    genreId: form.data.genreId,
    // 一ヶ月前に設定
    startCreatedAt: $dayjs(form.data.ym)
      .subtract(1, 'month')
      .startOf('month')
      .format('YYYY-MM-DD'),
    // 一ヶ月後に設定
    endCreatedAt: $dayjs(form.data.ym)
      .add(1, 'month')
      .endOf('month')
      .format('YYYY-MM-DD'),
  };

  await fetcher('GET', '/url-libraries', { query }).then((res) => {
    urlLibraries.value = res.data as UrlLibrary[];
  });
};

watch(
  () => form.data,
  () => {
    form.pushWithQuery('/calendar');
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
  <div>
    <OrganismsCalendarSearch :form="form" />
    <OrganismsCalendar :data="urlLibraries" :ym="form.data.ym" />
  </div>
</template>

<style lang="scss" scoped></style>
