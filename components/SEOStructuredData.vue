<script setup lang="ts">
interface StructuredDataProps {
  type?: 'website' | 'organization' | 'webpage';
  title?: string;
  description?: string;
  url?: string;
  breadcrumbs?: Array<{
    name: string;
    url: string;
  }>;
}

const props = withDefaults(defineProps<StructuredDataProps>(), {
  type: 'website',
  title: 'URLibrary - URL管理・ブックマーク整理ツール',
  description:
    'URLibraryは効率的なURL管理とブックマーク整理ができるWebアプリケーションです。タグ機能、カレンダー表示、メモ機能でWebサイトを体系的に管理できます。',
  url: 'https://url-library.com',
});

const getStructuredData = computed(() => {
  const baseData = {
    '@context': 'https://schema.org',
    '@type': props.type === 'organization' ? 'Organization' : 'WebSite',
    name: 'URLibrary',
    url: props.url,
    description: props.description,
  };

  if (props.type === 'website') {
    return {
      ...baseData,
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://url-library.com/?search={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    };
  }

  if (props.type === 'organization') {
    return {
      ...baseData,
      '@type': 'Organization',
      logo: 'https://url-library.com/og-image.svg',
      sameAs: [],
    };
  }

  if (props.type === 'webpage') {
    const webPageData = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: props.title,
      description: props.description,
      url: props.url,
      isPartOf: {
        '@type': 'WebSite',
        name: 'URLibrary',
        url: 'https://url-library.com',
      },
    };

    if (props.breadcrumbs && props.breadcrumbs.length > 0) {
      (webPageData as any).breadcrumb = {
        '@type': 'BreadcrumbList',
        itemListElement: props.breadcrumbs.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
    }

    return webPageData;
  }

  return baseData;
});

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(getStructuredData.value),
    },
  ],
});
</script>

<template>
  <!-- 構造化データは<head>に挿入されるため、テンプレートは空 -->
</template>
