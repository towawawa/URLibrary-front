<script lang="ts" setup>
type Props = {
  form: ReturnType<typeof useForm<{ ym: string; hashTagId: number | null }>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { hashTags } = useMaster();
</script>

<template>
  <div class="calendar-search" :class="props.class">
    <div class="search-controls">
      <div class="date-control">
        <MoleculesChangeDateField
          :value="props.form.data.ym"
          @change="props.form.update('ym', $event)"
        />
      </div>

      <div class="filter-control">
        <AtomsPulldown
          :options="hashTags"
          :value="props.form.data.hashTagId"
          placeholder="#タグで絞り込み"
          @change="props.form.update('hashTagId', $event)"
        />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.calendar-search {
  margin-bottom: 1.5rem;

  .search-controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;

    .date-control {
      flex-shrink: 0;
    }

    .filter-control {
      min-width: 200px;
      max-width: 300px;
      flex: 1;
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .calendar-search {
    margin-bottom: 1rem;

    .search-controls {
      flex-direction: column;
      align-items: stretch;
      gap: 0.75rem;

      .filter-control {
        min-width: auto;
        max-width: none;
      }
    }
  }
}

@media (max-width: 480px) {
  .calendar-search {
    margin-bottom: 0.75rem;

    .search-controls {
      gap: 0.5rem;
    }
  }
}
</style>
