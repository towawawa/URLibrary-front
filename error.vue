<script lang="ts" setup>
import type { NuxtError } from '#app';

useHead({ title: 'ERROR' });

const code = ref('');
const message = ref('');

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({}),
  },
});

const handleError = () => {
  clearError({ redirect: '/' });
};

onMounted(() => {
  switch (props.error?.statusCode) {
    case 403: {
      code.value = '403 FORBIDDEN.';
      message.value = 'アクセス権限がありません。';

      break;
    }
    case 404: {
      code.value = '404 NOT FOUND.';
      message.value =
        '指定のページは移動もしくは削除された可能性があります。 \n URLにタイプミスがないか再度ご確認ください。';

      break;
    }
    case 429: {
      code.value = '429 TOO MANY REQUESTS.';
      message.value = 'しばらく時間をおいてから再度ご利用ください。';

      break;
    }
    default: {
      code.value = '500 SYSTEM ERROR.';
      message.value =
        'システムエラーが発生しました。 \n 管理者へお問い合わせください。';

      break;
    }
  }
});
</script>

<template>
  <div class="error-container">
    <p class="error-code">{{ code }}</p>
    <p class="error-message">{{ message }}</p>
    <AtomsBtn @click="handleError"> TOPへ </AtomsBtn>
  </div>
</template>

<style lang="scss" scoped>
// @todo cssを充てる
.error-container {
}
</style>
