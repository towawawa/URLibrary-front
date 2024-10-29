<script lang="ts" setup>
const urlLibraries = ref<UrlLibrary[]>([]);
const ym = '2024-10';

const setUrlLibraries = async() => {
await fetcher('GET', '/url-libraries')
  .then((res) => {
    urlLibraries.value = res.data as UrlLibrary[];
  });
};

await setUrlLibraries();
</script>

<template>
  <div>
    <OrganismsCalendarSearch />
    <OrganismsCalendarCalendar :data="urlLibraries" :ym="ym" />
  </div>
</template>

<style lang="scss" scoped>

</style>
