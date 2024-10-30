<script lang="ts" setup>
import { getDateClass } from '@/utils/calendar';

type Props = {
  class?: string;
  date: string;
  data: UrlLibrary[];
  recordIndex: number;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { $dayjs } = useNuxtApp();

const day = Number($dayjs(props.date).format('DD'));
</script>

<template>
  <th class="cell">
    <p :class="['date', getDateClass(day, props.recordIndex)]">
      {{ day }}
    </p>
    <ul class="tag-container">
      <OrganismsCalendarTag
        v-for="item in props.data"
        :key="item.id"
        :data="item"
      />
    </ul>
  </th>
</template>

<style lang="scss" scoped>
.cell {
  display: inline-block;
  width: 200px;
  height: 150px;
  border-right: 0.5px solid $calendar-border;
  border-top: 0.5px solid $calendar-border;

  .tag-container {
    height: 115px;
    overflow-y: auto;
  }

  &:last-child {
    border-right: none;
  }

  .date {
    padding: 4px;
    font-size: 0.9rem;
    text-align: left;
    color: $dark-blue;

    &.another-month {
      color: $gray;
    }
  }
}
</style>
