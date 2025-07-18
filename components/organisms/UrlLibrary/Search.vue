<script lang="ts" setup>
type Props = {
  form: ReturnType<
    typeof useForm<{ hashTagId: number | null; keyword: string }>
  >;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { hashTags } = useMaster();
</script>

<template>
  <form :class="['search', props.class]" @submit.prevent>
    <!-- キーワード検索 -->
    <div class="search-field">
      <AtomsInput
        :value="props.form.data.keyword"
        placeholder="タイトルで検索..."
        @change="props.form.update('keyword', $event)"
      />
    </div>

    <!-- ハッシュタグ検索 -->
    <AtomsPulldown
      class="hashtag-filter"
      :options="hashTags"
      :value="props.form.data.hashTagId"
      placeholder="#タグで絞り込み"
      @change="props.form.update('hashTagId', $event)"
    />
  </form>
</template>

<style lang="scss" scoped>
.search {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 20px;

  .search-field {
    flex: 1;
    max-width: 300px;
  }

  .hashtag-filter {
    width: 200px;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .search {
    flex-direction: column;
    gap: 0.75rem;
    align-items: stretch;

    .search-field {
      max-width: none;
    }

    .hashtag-filter {
      width: 100%;
    }
  }
}
</style>
