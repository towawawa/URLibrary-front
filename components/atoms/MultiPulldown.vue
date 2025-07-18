<script setup lang="ts" generic="Value extends (string | number)[]">
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export type Option = { [key: string]: unknown };
type Props = {
  class?: string;
  placeholder?: string;
  options: Array<Option> | Readonly<Array<Option>>;
  value: Value;
  valueProp?: keyof Option;
  labelProp?: string;
  errorMessage?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  valueProp: 'id',
  labelProp: 'name',
  placeholder: '',
  errorMessage: '',
});

const emits = defineEmits<{
  (event: 'change', value: Value): void;
  (event: 'tag:create', tagName: string): void;
}>();

function onSelected(value: Value): void {
  emits('change', value);
}

function onTagCreate(tagName: string): void {
  emits('tag:create', tagName);
}

// reduce関数: 新しいタグと既存タグの両方に対応
const reduceFunction = (option: Option) => {
  const value = option[props.valueProp];
  // number型とstring型の両方をサポート
  return typeof value === 'string' || typeof value === 'number'
    ? value
    : option[props.valueProp];
};
</script>

<template>
  <div :class="['pulldown-container', props.class]">
    <v-select
      :multiple="true"
      :placeholder="props.placeholder"
      :model-value="props.value"
      :options="props.options"
      :label="props.labelProp"
      :reduce="reduceFunction"
      :push-tags="false"
      :clearable="true"
      @update:model-value="onSelected"
      @option:created="onTagCreate"
    >
      <template #no-options>
        <p class="text-left px-2">選択肢が見つかりません。</p>
      </template>
    </v-select>
    <p
      v-if="props.errorMessage"
      :class="{ 'c-error-message': props.errorMessage }"
    >
      {{ props.errorMessage }}
    </p>
  </div>
</template>

<style lang="scss">
// v-selectのスタイルを上書き
.pulldown-container {
  padding-bottom: 10px;

  .v-select {
    background-color: $white;

    .vs__dropdown-toggle {
      padding: 6px;
      border: 1px solid $border;
      width: 100%;
    }

    .vs__search::placeholder {
      color: $gray !important;
    }

    .vs__selected {
      background-color: $primary-light;
      color: $primary-dark;
      border: 1px solid $primary;
      border-radius: 4px;
      padding: 2px 8px;
      margin: 2px;
    }

    .vs__deselect {
      color: $primary;

      &:hover {
        color: $error;
      }
    }

    .option-text,
    .selected-text {
      font-weight: 500;
    }
  }

  .help-text {
    font-size: 0.75rem;
    color: $gray;
    margin-top: 0.25rem;
    font-style: italic;
  }

  &.is-error {
    .vs__dropdown-toggle {
      border-color: $error !important;
    }

    .error-message {
      color: $error;
      position: absolute;
      font-size: 0.8rem;
    }
  }
}
</style>
