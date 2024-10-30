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
  <form class="search" @submit.prevent>
    <MoleculesChangeDateField
      :value="props.form.data.ym"
      @change="props.form.update('ym', $event)"
    />
    <AtomsPulldown
      class="ml-5 w-80"
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
  margin-top: 20px;
}
</style>
