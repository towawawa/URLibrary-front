<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import type { UrlLibrary } from '@/types/api/urlLibrary';

type Props = {
  class?: string;
  data: UrlLibrary;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

// OGP画像のURLを格納するリアクティブデータ
const ogpImageUrl = ref<string | null>(null);

// OGP画像を取得する関数
const fetchOGP = async (url: string) => {
  //rulの末尾に/をつける
  if (!url.endsWith('/')) {
    url += '/';
  }
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
  const response = await fetch(proxyUrl);
  const html = await response.text();
  const domParser = new DOMParser();
  const dom = domParser.parseFromString(html, 'text/html');
  const ogp = Object.fromEntries(
    [...dom.head.children]
      .filter(
        (element) =>
          element.tagName === 'META' &&
          element.getAttribute('property')?.startsWith('og:'),
      )
      .map((element) => {
        return [
          element.getAttribute('property'),
          element.getAttribute('content'),
        ];
      }),
  );
  ogpImageUrl.value = ogp['og:image'];
};

const emits = defineEmits<{
  (event: 'click-note'): void;
  (event: 'click-edit'): void;
  (event: 'click-delete'): void;
}>();

// コンポーネントがマウントされたときにOGP画像を取得
onMounted(() => {
  fetchOGP(props.data.url);
});
</script>

<template>
  <li>
    <div class="left-block">
      <img
        class="pencil"
        src="@/assets/images/pencil-icon.svg"
        @click="emits('click-edit')"
      />
    </div>
    <a class="center-block" :href="props.data.url" target="_blank">
      <div>
        <p class="url-title">{{ props.data.title }}</p>
        <p class="url">{{ props.data.url }}</p>
        <div class="hash-tags">
          <AtomsHashTagText
            v-for="tag in props.data.hashTags"
            :key="tag.id"
            :name="tag.name"
          />
        </div>
      </div>

      <!-- OGP画像を表示 -->
      <img v-if="ogpImageUrl" :src="ogpImageUrl" />
    </a>
    <div class="right-block">
      <img
        class="note"
        src="@/assets/images/note-icon.svg"
        @click="emits('click-note')"
      />
      <img
        class="trash"
        src="@/assets/images/trash-icon.svg"
        @click="emits('click-delete')"
      />
    </div>
  </li>
</template>

<style lang="scss" scoped>
img {
  width: 30px;
  height: 30px;
  cursor: pointer;

  &.ogp {
    width: 100%;
    max-height: 200px;
    object-fit: cover;
    margin-top: 10px;
  }
}

li {
  display: flex;
  justify-content: space-between;
  align-items: left;
  width: 85%;
  margin-bottom: 30px;

  .left-block {
    display: flex;
    justify-content: right;
    margin-right: 15px;
    align-items: center;
  }

  .center-block {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 0 0 20px;
    background-color: $white;
    border-radius: 20px;
    height: 180px;

    p {
      margin: 0;

      &.url-title {
        font-size: 1.2rem;
        font-weight: bold;
      }

      &.url {
        margin-top: 5px;
        font-size: 0.8rem;
      }
    }

    .hash-tags {
      margin-top: 5px;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
    }

    img {
      width: 100%;
      height: 100%;
      max-width: 400px;
      max-height: 180px;
      object-fit: cover;
      border-radius: 0 20px 20px 0;
    }
  }

  .right-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: left;
    margin-left: 15px;

    img {
      margin: 15px 0;
    }
  }
}
</style>
