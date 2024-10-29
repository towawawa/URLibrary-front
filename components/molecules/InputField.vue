<script setup lang="ts">
type Props = {
  class?: string;
  label?: string;
  required?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  label: '',
  class: '',
  required: false,
});
</script>

<template>
  <fieldset :class="props.class">
    <legend>
      {{ props.label }}
      <span v-if="props.required" class="required">*</span>
    </legend>
    <!--入力フィールド-->
    <slot></slot>
  </fieldset>
</template>

<style lang="scss" scoped>
fieldset {
  margin-bottom: 15px;
  legend {
    font-size: 0.9rem;
    text-align: left;
    .required {
      color: $error;
      margin-left: 2px;
    }
  }
}
</style>
