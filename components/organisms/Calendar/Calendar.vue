<script lang="ts" setup>
import { getWeeks, splitCalendarDataByWeek } from '@/utils/calendar';
import type { UrlLibrary } from '@/types/api/urlLibrary';

type Props = {
  class?: string;
  ym: string; // 年月
  data: UrlLibrary[];
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const weeks = ref(getWeeks(props.ym));
const weeklyData = ref<UrlLibrary[][][]>([]);

watch(
  () => props.data,
  () => {
    weeks.value = getWeeks(props.ym);
    weeklyData.value = splitCalendarDataByWeek(weeks.value, props.data);
  },
  {
    deep: true,
    immediate: true,
  },
);
</script>

<template>
  <table class="calendar">
    <thead>
      <tr class="weekday">
        <th class="sunday">日 <span>SUN</span></th>
        <th>月 <span>MON</span></th>
        <th>火 <span>TUE</span></th>
        <th>水 <span>WED</span></th>
        <th>木 <span>THU</span></th>
        <th>金 <span>FRI</span></th>
        <th class="saturday">土<span>SAT</span></th>
      </tr>
    </thead>

    <tbody>
      <OrganismsCalendarRecord
        v-for="(week, index) in weeks"
        :key="index"
        :dates="week"
        :data="weeklyData[index] ? weeklyData[index] : []"
        :record-index="index"
      />
    </tbody>
  </table>
</template>

<style lang="scss" scoped>
.calendar {
  margin: 0 30px 30px 30px;
  background-color: $white;
  border-radius: 3px;
  display: inline-block;
  thead {
    .weekday {
      display: flex;
      th {
        padding: 8px 0;
        width: 200px;
        background-color: $light-blue;
        color: $dark-blue;
        font-size: 1rem;
        border-right: 1px solid $calendar-border;

        &:last-child {
          border-right: none;
        }

        span {
          margin-left: 3px;
          font-size: 0.8rem;
        }

        &.sunday {
          color: $red;
        }

        &.saturday {
          color: $blue;
        }
      }
    }
  }
}
</style>
