<script lang="ts" setup>
import dayjs from 'dayjs';

type Props = {
  class?: string;
  date: string;
  data: UrlLibrary[];
}

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

</script>

<template>
    <th class="cell">
      <p class="date">{{ dayjs(props.date).format('DD') }}</p>
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
  min-height:125px;
  border-right: 0.5px solid $calendar-border;
  border-top: 0.5px solid $calendar-border;
  &:last-child {
    border-right: none;
  }

.date {
  padding: 4px;
  font-size: 0.9rem;
  text-align: left;
  color: $dark-blue;
}
}
</style>
