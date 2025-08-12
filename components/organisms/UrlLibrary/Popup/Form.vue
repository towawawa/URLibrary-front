<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import type { Form } from '@/utils/forms/urlLibrary';

type Props = {
  form: ReturnType<typeof useForm<Form>>;
  class?: string;
};

const props = withDefaults(defineProps<Props>(), {
  class: '',
});

const { hashTags, genres, getMasters } = useMaster();

// 新しいハッシュタグが作成された時の処理
const handleTagCreate = async (tag: unknown) => {
  const tagName =
    typeof tag === 'string'
      ? tag
      : typeof (tag as Record<string, unknown>)?.name === 'string'
        ? ((tag as Record<string, unknown>).name as string)
        : '';
  if (!tagName || tagName.trim().length === 0) return;
  // 既に存在するかチェック
  const existingTag = hashTags.value.find((tag) => tag.name === tagName);
  if (existingTag) {
    // 既存のタグがあれば選択状態に追加
    if (!props.form.data.hashTagIds.includes(existingTag.id)) {
      props.form.update('hashTagIds', [
        ...props.form.data.hashTagIds,
        existingTag.id,
      ]);
    }
    return;
  }

  // 新しいタグをAPIで登録
  await fetcher('POST', '/hash-tags', { body: { name: tagName } });

  // マスターデータを取得し直す
  await getMasters();

  // 新しく作成されたタグを見つけてフォームに追加
  const newTag = hashTags.value.find((tag) => tag.name === tagName);

  if (newTag) {
    props.form.update('hashTagIds', [...props.form.data.hashTagIds, newTag.id]);
  }
};

// ------------------------------
// URL入力時にタイトルを自動取得
// ------------------------------
let urlInputTimer: ReturnType<typeof setTimeout> | null = null;
const currentFetchController = ref<AbortController | null>(null);

const isSkippableUrl = (rawUrl: string): boolean => {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl);
  } catch {
    return true;
  }

  const hostname = parsed.hostname.toLowerCase();
  if (
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname.startsWith('192.168.') ||
    hostname.startsWith('10.') ||
    hostname.startsWith('172.') ||
    hostname.endsWith('.local') ||
    !hostname.includes('.')
  ) {
    return true;
  }

  // HTTPS以外はスキップ（CORSプロキシの制限に合わせる）
  if (parsed.protocol !== 'https:') return true;

  return false;
};

const fetchPageTitle = async (rawUrl: string): Promise<string | null> => {
  if (!rawUrl || isSkippableUrl(rawUrl)) return null;

  // 入力の度に前回のリクエストを中断
  if (currentFetchController.value) {
    currentFetchController.value.abort();
  }
  const controller = new AbortController();
  currentFetchController.value = controller;

  try {
    let url = rawUrl;
    if (!url.endsWith('/')) url += '/';
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl, { signal: controller.signal });
    if (!response.ok) return null;
    const html = await response.text();

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    const ogTitle = doc
      .querySelector('meta[property="og:title"]')
      ?.getAttribute('content')
      ?.trim();
    const docTitle = doc.querySelector('title')?.textContent?.trim();

    const title = ogTitle || docTitle || null;
    return title && title.length > 0 ? title : null;
  } catch (e) {
    return null;
  } finally {
    if (currentFetchController.value === controller) {
      currentFetchController.value = null;
    }
  }
};

const scheduleFetchTitle = (url: string) => {
  if (urlInputTimer) clearTimeout(urlInputTimer);
  if (!url) return;
  urlInputTimer = setTimeout(async () => {
    // ユーザーが既にタイトルを入力していれば上書きしない
    if (props.form.data.title && props.form.data.title.trim().length > 0)
      return;
    const fetchedTitle = await fetchPageTitle(url);
    if (
      fetchedTitle &&
      (!props.form.data.title || props.form.data.title.trim().length === 0)
    ) {
      props.form.update('title', fetchedTitle);
    }
  }, 600);
};

watch(
  () => props.form.data.url,
  (newUrl) => {
    scheduleFetchTitle(newUrl);
  },
);

onBeforeUnmount(() => {
  if (urlInputTimer) clearTimeout(urlInputTimer);
  if (currentFetchController.value) currentFetchController.value.abort();
});

// URL未入力時は他フィールドを無効化
const isUrlEmpty = computed(
  () => !props.form.data.url || props.form.data.url.trim().length === 0,
);
</script>

<template>
  <form class="url-form">
    <MoleculesInputField label="URL" :required="true">
      <AtomsInput
        :value="props.form.data.url"
        :error-message="props.form.firstError('url')"
        @change="props.form.update('url', $event)"
        @input="props.form.update('url', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="タイトル" :required="true">
      <AtomsInput
        :value="props.form.data.title"
        :error-message="props.form.firstError('title')"
        :disabled="isUrlEmpty"
        @change="props.form.update('title', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="ジャンル">
      <AtomsPulldown
        :options="genres"
        :value="props.form.data.genreId"
        :error-message="props.form.firstError('genreId')"
        :disabled="isUrlEmpty"
        @change="props.form.update('genreId', $event)"
      />
    </MoleculesInputField>
    <MoleculesInputField label="タグ">
      <AtomsMultiPulldown
        :options="hashTags"
        :value="props.form.data.hashTagIds"
        :error-message="props.form.firstError('hashTagIds')"
        label-prop="name"
        value-prop="id"
        placeholder="タグを選択するか、新しいタグを入力してください"
        :disabled="isUrlEmpty"
        @change="props.form.update('hashTagIds', $event)"
        @tag:create="handleTagCreate"
      />
    </MoleculesInputField>
    <MoleculesInputField label="メモ">
      <AtomsTextarea
        :value="props.form.data.note"
        :error-message="props.form.firstError('note')"
        :disabled="isUrlEmpty"
        @change="props.form.update('note', $event)"
      />
    </MoleculesInputField>
  </form>
</template>

<style lang="scss" scoped>
.url-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
</style>
