<script lang="ts" setup>
type Props = {
  class?: string;
  id: number;
};

const isFetching = ref(true);

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const form = useForm<{
  note: string;
}>({
  note: '',
});

const setNote = async () => {
  await fetcher('GET', `/url-libraries/${props.id}`).then((res) => {
    form.update('note', (res.data as UrlLibrary).note);
    isFetching.value = false;
  });
};

const updateNote = async (event: Event) => {
  form.update('note', (event.target as HTMLTextAreaElement).value);
  await fetcher('PUT', `/url-libraries/${props.id}/note`, {
    body: {
      note: form.data.note,
    },
  });
};

const emits = defineEmits<{
  (event: 'close'): void;
}>();

// idが変わったらノートを取得
watch(
  () => props.id,
  () => {
    setNote();
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="!isFetching" class="note">
    <img src="@/assets/images/delete-icon.svg" @click="emits('close')" />
    <textarea @change="updateNote($event)">{{ form.data.note }}</textarea>
  </div>
</template>

<style lang="scss" scoped>
.note {
  width: 100%;
  height: 100%;
  margin-top: 5px;
  position: relative;

  img {
    width: 25px;
    height: 25px;
    cursor: pointer;
    position: absolute;
    right: 10px;
    top: 10px;
  }

  textarea {
    width: 100%;
    height: 100%;
    resize: none;
    border: none;
    background-color: $white;
    padding: 40px 10px 10px 10px;
    font-size: 18px;
    border: 1px solid $border;
  }
}
</style>
