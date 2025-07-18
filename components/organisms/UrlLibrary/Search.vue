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
    <!-- ハッシュタグ検索のみ -->
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

  .hashtag-filter {
    width: 200px;
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .search {
    .hashtag-filter {
      width: 100%;
    }
  }
}
</style>
