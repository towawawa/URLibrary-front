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

// 曜日の定義
const weekdays = [
  { jp: '日', en: 'SUN', class: 'sunday' },
  { jp: '月', en: 'MON', class: 'monday' },
  { jp: '火', en: 'TUE', class: 'tuesday' },
  { jp: '水', en: 'WED', class: 'wednesday' },
  { jp: '木', en: 'THU', class: 'thursday' },
  { jp: '金', en: 'FRI', class: 'friday' },
  { jp: '土', en: 'SAT', class: 'saturday' },
];
</script>

<template>
  <div class="calendar-container">
    <div class="calendar">
      <!-- 曜日ヘッダー -->
      <div class="calendar-header">
        <div
          v-for="(day, index) in weekdays"
          :key="index"
          class="weekday-header"
          :class="day.class"
        >
          <div class="weekday-container">
            <span class="weekday-jp">{{ day.jp }}</span>
            <span class="weekday-en">{{ day.en }}</span>
          </div>
        </div>
      </div>

      <!-- カレンダー本体 -->
      <div class="calendar-body">
        <template v-for="(week, weekIndex) in weeks" :key="weekIndex">
          <OrganismsCalendarCell
            v-for="(date, dayIndex) in week"
            :key="`${weekIndex}-${dayIndex}`"
            :date="date"
            :data="
              weeklyData[weekIndex] && weeklyData[weekIndex][dayIndex]
                ? weeklyData[weekIndex][dayIndex]
                : []
            "
            :day-index="dayIndex"
          />
        </template>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-container {
  padding: 1rem;
  max-width: 100%;
  overflow-x: auto;
}

.calendar {
  background: $white;
  border-radius: 6px;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-width: 800px;
  border: 1px solid $border;

  .calendar-header {
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    background: $gray-50;
    border-bottom: 1px solid $border;

    .weekday-header {
      padding: 0.375rem 0.25rem;
      text-align: center;
      font-weight: 600;
      font-size: 0.8rem;
      color: $text;
      border-right: 1px solid $border;

      &:last-child {
        border-right: none;
      }

      .weekday-container {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
      }

      .weekday-jp {
        font-size: 0.85rem;
        font-weight: 600;
      }

      .weekday-en {
        font-size: 0.6rem;
        color: $text-muted;
        font-weight: 500;
      }

      &.sunday {
        background: rgba(239, 68, 68, 0.05);
        .weekday-jp {
          color: $error;
        }
      }

      &.saturday {
        background: rgba(59, 130, 246, 0.05);
        .weekday-jp {
          color: $blue;
        }
      }
    }
  }

  .calendar-body {
    display: grid;
    grid-template-columns: repeat(7, 1fr);

    :deep(.calendar-cell) {
      min-height: 130px; // 100pxから130pxに増加
      border-right: 1px solid $border;
      border-bottom: 1px solid $border;

      &:nth-child(7n) {
        border-right: none;
      }

      &:nth-last-child(-n + 7) {
        border-bottom: none;
      }
    }
  }
}

// レスポンシブ対応
@media (max-width: 1024px) {
  .calendar-container {
    padding: 0.75rem;
  }

  .calendar {
    min-width: 700px;

    .calendar-header .weekday-header {
      padding: 0.375rem 0.25rem;

      .weekday-jp {
        font-size: 0.8rem;
      }

      .weekday-en {
        font-size: 0.55rem;
      }
    }

    .calendar-body :deep(.calendar-cell) {
      min-height: 110px; // 80pxから110pxに増加
    }
  }
}

@media (max-width: 768px) {
  .calendar-container {
    padding: 0.5rem;
    margin: 0 -0.5rem;
  }

  .calendar {
    min-width: 600px;
    border-radius: 4px;

    .calendar-header .weekday-header {
      padding: 0.25rem 0.125rem;

      .weekday-container {
        gap: 0.375rem;
      }

      .weekday-jp {
        font-size: 0.8rem;
      }

      .weekday-en {
        font-size: 0.55rem;
      }
    }

    .calendar-body :deep(.calendar-cell) {
      min-height: 90px; // 70pxから90pxに増加
    }
  }
}

@media (max-width: 480px) {
  .calendar {
    min-width: 500px;

    .calendar-header .weekday-header {
      padding: 0.25rem 0.0625rem;

      .weekday-jp {
        font-size: 0.7rem;
      }
    }

    .calendar-body :deep(.calendar-cell) {
      min-height: 80px; // 60pxから80pxに増加
    }
  }
}
</style>
