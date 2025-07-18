<script lang="ts" setup>
import type { NuxtError } from '#app';

useHead({ title: 'ERROR' });

const code = ref('');
const message = ref('');
const icon = ref('');
const color = ref('');

const props = defineProps({
  error: {
    type: Object as () => NuxtError,
    default: () => ({}),
  },
});

const handleError = () => {
  clearError({ redirect: '/' });
};

const reloadPage = () => {
  if (import.meta.client) {
    window.location.reload();
  }
};

onMounted(() => {
  switch (props.error?.statusCode) {
    case 403: {
      code.value = '403';
      message.value = 'アクセス権限がありません。';
      icon.value = 'fas fa-lock';
      color.value = 'warning';
      break;
    }
    case 404: {
      code.value = '404';
      message.value =
        '指定のページは移動もしくは削除された可能性があります。\nURLにタイプミスがないか再度ご確認ください。';
      icon.value = 'fas fa-search';
      color.value = 'primary';
      break;
    }
    case 429: {
      code.value = '429';
      message.value = 'しばらく時間をおいてから再度ご利用ください。';
      icon.value = 'fas fa-clock';
      color.value = 'warning';
      break;
    }
    default: {
      code.value = '500';
      message.value =
        'システムエラーが発生しました。\n管理者へお問い合わせください。';
      icon.value = 'fas fa-exclamation-triangle';
      color.value = 'error';
      break;
    }
  }
});
</script>

<template>
  <div class="error-page">
    <div class="error-container">
      <!-- Background decoration -->
      <div class="bg-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
        <div class="circle circle-3"></div>
      </div>

      <!-- Error content -->
      <div class="error-content">
        <div class="error-icon" :class="`error-${color}`">
          <i :class="icon"></i>
        </div>

        <h1 class="error-code">{{ code }}</h1>
        <h2 class="error-title">エラーが発生しました</h2>
        <p class="error-message">{{ message }}</p>

        <div class="error-actions">
          <AtomsBtn class="home-btn" size="lg" @click="handleError">
            <i class="fas fa-home"></i>
            ホームに戻る
          </AtomsBtn>

          <button class="reload-btn" @click="reloadPage">
            <i class="fas fa-redo"></i>
            ページを再読み込み
          </button>
        </div>
      </div>

      <!-- URLibrary logo -->
      <div class="error-footer">
        <nuxt-link to="/" class="logo-link">
          <span class="logo">URLibrary</span>
        </nuxt-link>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-page {
  min-height: 100vh;
  background: linear-gradient(
    135deg,
    $primary-light 0%,
    $white 50%,
    $blue-light 100%
  );
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
  position: relative;
  overflow: hidden;
}

.error-container {
  max-width: 600px;
  width: 100%;
  position: relative;
  z-index: 2;
}

.bg-decoration {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(116, 160, 67, 0.1);
    animation: float 6s ease-in-out infinite;

    &.circle-1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: -50px;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: -30px;
      animation-delay: 2s;
      background: rgba(59, 130, 246, 0.1);
    }

    &.circle-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
  }
}

.error-content {
  background: $white;
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid $border;
  position: relative;
}

.error-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  font-size: 2rem;

  &.error-primary {
    background: $primary-light;
    color: $primary;
  }

  &.error-warning {
    background: $warning-light;
    color: $warning;
  }

  &.error-error {
    background: $error-light;
    color: $error;
  }
}

.error-code {
  font-size: 4rem;
  font-weight: 700;
  color: $text;
  margin: 0 0 0.5rem 0;
  line-height: 1;
  background: linear-gradient(135deg, $primary, $blue);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.error-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: $text;
  margin: 0 0 1rem 0;
}

.error-message {
  font-size: 1rem;
  color: $text-muted;
  line-height: 1.6;
  margin: 0 0 2rem 0;
  white-space: pre-line;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;

  .home-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    font-weight: 600;
  }

  .reload-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background: $gray-100;
    color: $text;
    border: 1px solid $border;
    border-radius: 6px;
    font-size: 0.9rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover {
      background: $gray-200;
      transform: translateY(-1px);
    }

    i {
      font-size: 0.8rem;
    }
  }
}

.error-footer {
  text-align: center;
  margin-top: 2rem;

  .logo-link {
    text-decoration: none;

    .logo {
      font-size: 1.5rem;
      font-weight: 700;
      color: $primary;
      transition: color 0.2s ease;

      &:hover {
        color: $primary-hover;
      }
    }
  }
}

// アニメーション
@keyframes float {
  0%,
  100% {
    transform: translateY(0px) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(180deg);
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .error-page {
    padding: 0.5rem;
  }

  .error-content {
    padding: 2rem 1.5rem;
  }

  .error-code {
    font-size: 3rem;
  }

  .error-title {
    font-size: 1.25rem;
  }

  .error-message {
    font-size: 0.9rem;
  }

  .error-actions {
    flex-direction: column;
    align-items: center;

    .home-btn,
    .reload-btn {
      width: 100%;
      max-width: 200px;
      justify-content: center;
    }
  }

  .bg-decoration .circle {
    &.circle-1 {
      width: 150px;
      height: 150px;
    }

    &.circle-2 {
      width: 100px;
      height: 100px;
    }

    &.circle-3 {
      width: 80px;
      height: 80px;
    }
  }
}

@media (max-width: 480px) {
  .error-content {
    padding: 1.5rem 1rem;
  }

  .error-code {
    font-size: 2.5rem;
  }

  .error-icon {
    width: 60px;
    height: 60px;
    font-size: 1.5rem;
  }
}
</style>
