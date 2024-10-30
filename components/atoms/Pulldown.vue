<script setup lang="ts" generic="Value extends string | number | null">
import vSelect from 'vue-select';
import 'vue-select/dist/vue-select.css';

export type Option = { [key: string]: unknown };
type Props = {
  class?: string;
  placeholder?: string;
  options: Array<Option> | Readonly<Array<Option>>;
  value: Value | undefined;
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
}>();

function onSelected(value: Value): void {
  emits('change', value);
}
</script>

<template>
  <div
    :class="[
      'pulldown-container',
      props.class,
      {
        'is-error': props.errorMessage,
      },
    ]"
  >
    <v-select
      :placeholder="props.placeholder"
      :model-value="props.value"
      :options="props.options"
      :label="props.labelProp"
      :reduce="(option: Option) => option[props.valueProp]"
      append-to-body
      @update:model-value="onSelected"
    >
      <template #no-options>
        <p class="text-left px-2">選択肢が見つかりません。</p>
      </template>
    </v-select>
    <p
      v-if="props.errorMessage"
      :class="{ 'error-message': props.errorMessage }"
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
