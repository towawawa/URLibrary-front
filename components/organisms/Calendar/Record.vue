<script lang="ts" setup>
type Props = {
  class?: string;
  dates: string[];
  data: UrlLibrary[][];
  recordIndex: number;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <tr class="record">
    <OrganismsCalendarCell
      v-for="(date, index) in props.dates"
      :key="date"
      :date="date"
      :data="props.data[index] ? props.data[index] : []"
      :record-index="props.recordIndex"
    />
  </tr>
</template>

<style lang="scss" scoped>
.record {
  &:first-child {
    border-top: 2px solid $calendar-border;
  }
}
</style>
