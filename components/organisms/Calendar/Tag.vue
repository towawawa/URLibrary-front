<script lang="ts" setup>
type Props = {
  class?: string;
  data: UrlLibrary;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});
</script>

<template>
  <a
    class="calendar-tag"
    :key="props.data.id"
    :href="props.data.url"
    target="_blank"
  >
    <div class="tag-title">{{ props.data.title }}</div>
    <div class="tag-url">{{ props.data.url }}</div>
  </a>
</template>

<style lang="scss" scoped>
.calendar-tag {
  display: block;
  padding: 0.5rem 0.625rem;
  background: $primary-light;
  border-left: 3px solid $primary;
  color: $primary-dark;
  font-size: 0.75rem;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  text-align: left;
  margin-bottom: 0.25rem;
  border-radius: 0 4px 4px 0;
  transition: all 0.2s ease;
  line-height: 1.3;
  max-width: 200px;

  .tag-title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    // タイトルの省略表示
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .tag-url {
    font-size: 0.65rem;
    color: lighten($primary-dark, 15%);
    font-weight: 400;
    // URLの省略表示
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  &:hover {
    background: $primary;
    color: $white;
    transform: translateX(2px);

    .tag-url {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  &:last-child {
    margin-bottom: 0;
  }
}

// スマホ対応でサイズを小さくする
@media (max-width: 768px) {
  .calendar-tag {
    padding: 0.25rem 0.375rem;
    font-size: 0.65rem;
    margin-bottom: 0.1875rem;
    line-height: 1.2;
    width: 70px;

    .tag-title {
      font-size: 0.65rem;
      margin-bottom: 0.125rem;
    }

    .tag-url {
      font-size: 0.55rem;
    }
  }
}

@media (max-width: 480px) {
  .calendar-tag {
    padding: 0.1875rem 0.25rem;
    font-size: 0.6rem;
    margin-bottom: 0.125rem;
    line-height: 1.1;

    .tag-title {
      font-size: 0.6rem;
      margin-bottom: 0.0625rem;
    }

    .tag-url {
      font-size: 0.5rem;
    }
  }
}
</style>
