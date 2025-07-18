<script lang="ts" setup>
import { getDateClass } from '@/utils/calendar';

type Props = {
  class?: string;
  date: string;
  data: UrlLibrary[];
  dayIndex: number;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { $dayjs } = useNuxtApp();

const day = Number($dayjs(props.date).format('DD'));
const isToday = $dayjs(props.date).isSame($dayjs(), 'day');
const isCurrentMonth = $dayjs(props.date).isSame($dayjs(), 'month');
const isSunday = props.dayIndex === 0;
const isSaturday = props.dayIndex === 6;

// 表示制御
const isExpanded = ref(false);
const INITIAL_DISPLAY_COUNT = 3;

const visibleData = computed(() => {
  if (isExpanded.value || props.data.length <= INITIAL_DISPLAY_COUNT) {
    return props.data;
  }
  return props.data.slice(0, INITIAL_DISPLAY_COUNT);
});

const hasMoreItems = computed(() => {
  return props.data.length > INITIAL_DISPLAY_COUNT;
});

const hiddenItemsCount = computed(() => {
  return Math.max(0, props.data.length - INITIAL_DISPLAY_COUNT);
});

const toggleExpanded = () => {
  isExpanded.value = !isExpanded.value;
};
</script>

<template>
  <div class="calendar-cell">
    <!-- 日付表示 -->
    <div class="date-header">
      <span
        class="date-number"
        :class="{
          today: isToday,
          'other-month': !isCurrentMonth,
          sunday: isSunday,
          saturday: isSaturday,
        }"
      >
        {{ day }}
      </span>
      <span v-if="data.length > 0" class="count-badge">
        {{ data.length }}
      </span>
    </div>

    <!-- URL一覧 -->
    <div class="url-list" :class="{ expanded: isExpanded }">
      <OrganismsCalendarTag
        v-for="item in visibleData"
        :key="item.id"
        :data="item"
      />

      <!-- さらに表示/閉じるボタン -->
      <div v-if="hasMoreItems" class="toggle-section">
        <button
          v-if="!isExpanded"
          class="toggle-btn show-more"
          @click="toggleExpanded"
        >
          <i class="fas fa-chevron-down"></i>
          さらに{{ hiddenItemsCount }}件表示
        </button>

        <button v-else class="toggle-btn show-less" @click="toggleExpanded">
          <i class="fas fa-chevron-up"></i>
          閉じる
        </button>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-cell {
  background: $white;
  padding: 0.5rem 0.375rem;
  transition: all 0.2s ease;
  position: relative;
  cursor: pointer;

  &:hover {
    background: $gray-50;
  }

  .date-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.375rem;

    .date-number {
      font-size: 0.9rem;
      font-weight: 600;
      color: $text;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      transition: all 0.2s ease;

      &.today {
        background: $primary;
        color: $white;
        box-shadow: 0 2px 4px rgba(116, 160, 67, 0.3);
      }

      &.other-month {
        color: $text-muted;
        font-weight: 400;
      }

      &.sunday:not(.today) {
        color: $error;
      }

      &.saturday:not(.today) {
        color: $blue;
      }
    }

    .count-badge {
      background: $primary;
      color: $white;
      font-size: 0.6rem;
      font-weight: 600;
      padding: 0.0625rem 0.25rem;
      border-radius: 8px;
      min-width: 1rem;
      text-align: center;
    }
  }

  .url-list {
    min-height: 2rem;
    max-height: 4rem;
    overflow: hidden;
    transition: max-height 0.3s ease;

    &.expanded {
      max-height: 12rem;
      overflow-y: auto;

      /* カスタムスクロールバー */
      &::-webkit-scrollbar {
        width: 3px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: $gray-300;
        border-radius: 1.5px;

        &:hover {
          background: $gray-300;
        }
      }
    }

    .toggle-section {
      margin-top: 0.25rem;

      .toggle-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        width: 100%;
        padding: 0.25rem 0.375rem;
        background: none;
        border: 1px solid $border;
        border-radius: 4px;
        color: $text-muted;
        font-size: 0.6rem;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;

        i {
          font-size: 0.5rem;
        }

        &:hover {
          background: $gray-100;
          color: $text;
          border-color: $gray-300;
        }

        &.show-more {
          &:hover {
            background: $primary-light;
            color: $primary;
            border-color: $primary;
          }
        }

        &.show-less {
          background: $primary-light;
          color: $primary;
          border-color: $primary;

          &:hover {
            background: $primary;
            color: $white;
          }
        }
      }
    }
  }
}

// レスポンシブ対応
@media (max-width: 1024px) {
  .calendar-cell {
    padding: 0.375rem 0.25rem;

    .date-header .date-number {
      font-size: 0.85rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    .url-list {
      min-height: 1.75rem;
      max-height: 3.5rem;

      &.expanded {
        max-height: 10rem;
      }

      .toggle-section .toggle-btn {
        padding: 0.1875rem 0.25rem;
        font-size: 0.55rem;

        i {
          font-size: 0.45rem;
        }
      }
    }
  }
}

@media (max-width: 768px) {
  .calendar-cell {
    padding: 0.25rem 0.125rem;

    .date-header {
      margin-bottom: 0.25rem;

      .date-number {
        font-size: 0.8rem;
        width: 1.125rem;
        height: 1.125rem;
      }

      .count-badge {
        font-size: 0.55rem;
        padding: 0.0625rem 0.1875rem;
      }
    }

    .url-list {
      min-height: 1.5rem;
      max-height: 3rem;

      &.expanded {
        max-height: 8rem;
      }

      .toggle-section .toggle-btn {
        padding: 0.125rem 0.1875rem;
        font-size: 0.5rem;

        i {
          font-size: 0.4rem;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .calendar-cell {
    padding: 0.1875rem 0.0625rem;

    .date-header {
      margin-bottom: 0.1875rem;

      .date-number {
        font-size: 0.75rem;
        width: 1rem;
        height: 1rem;
      }

      .count-badge {
        font-size: 0.5rem;
        padding: 0.0625rem 0.125rem;
      }
    }

    .url-list {
      min-height: 1.25rem;
      max-height: 2.5rem;

      &.expanded {
        max-height: 6rem;
      }

      .toggle-section .toggle-btn {
        padding: 0.0625rem 0.125rem;
        font-size: 0.45rem;
        gap: 0.125rem;

        i {
          font-size: 0.35rem;
        }
      }
    }
  }
}
</style>
