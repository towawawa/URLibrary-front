<script setup lang="ts">
type Props = {
  class?: string;
  adSlot: string; // 広告ユニットID
  adFormat?: string; // 広告フォーマット
  adLayout?: string; // レイアウト
  fullWidthResponsive?: boolean; // レスポンシブ対応
  style?: string | Record<string, any>; // カスタムスタイル
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
  adFormat: 'auto',
  adLayout: '',
  fullWidthResponsive: true,
  style: 'display:block',
});

// AdSenseが読み込まれているかチェック
const isAdSenseLoaded = computed(() => {
  return typeof window !== 'undefined' && window.adsbygoogle;
});

// 広告を初期化
onMounted(() => {
  if (isAdSenseLoaded.value) {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (error) {
      console.error('AdSense initialization error:', error);
    }
  }
});

// styleを文字列に変換
const computedStyle = computed(() => {
  if (typeof props.style === 'string') {
    return props.style;
  }
  return Object.entries(props.style || {})
    .map(([key, value]) => `${key}:${value}`)
    .join('; ');
});
</script>

<template>
  <div :class="['adsense-container', props.class]">
    <ins
      class="adsbygoogle"
      :style="computedStyle"
      :data-ad-client="$config.public.adsenseClientId"
      :data-ad-slot="props.adSlot"
      :data-ad-format="props.adFormat"
      :data-ad-layout="props.adLayout"
      :data-full-width-responsive="props.fullWidthResponsive"
    ></ins>

    <!-- AdSenseが読み込まれていない場合のフォールバック -->
    <div v-if="!isAdSenseLoaded" class="ad-fallback">
      <div class="ad-placeholder">
        <i class="fas fa-bullhorn"></i>
        <p>広告スペース</p>
        <small>AdSense読み込み中...</small>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.adsense-container {
  width: 100%;

  .adsbygoogle {
    display: block;
    text-align: center;
  }

  .ad-fallback {
    background: $gray-50;
    border: 2px dashed $border;
    border-radius: 8px;
    padding: 1.5rem;
    text-align: center;

    .ad-placeholder {
      color: $text-muted;

      i {
        font-size: 2rem;
        margin-bottom: 0.75rem;
        display: block;
      }

      p {
        margin: 0 0 0.25rem 0;
        font-weight: 600;
        font-size: 0.9rem;
      }

      small {
        font-size: 0.75rem;
      }
    }
  }
}

// レスポンシブ対応
@media (max-width: 768px) {
  .adsense-container {
    .ad-fallback {
      padding: 1rem;

      .ad-placeholder {
        i {
          font-size: 1.5rem;
        }

        p {
          font-size: 0.8rem;
        }

        small {
          font-size: 0.7rem;
        }
      }
    }
  }
}
</style>
