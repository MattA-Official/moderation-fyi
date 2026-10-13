<script setup lang="ts">
const route = useRoute()
const { resolveAuthors } = await useAuthors()

const { data: article } = await useAsyncData(route.path, () => queryCollection('articles').path(route.path).first())
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => queryCollectionItemSurroundings('articles', route.path, {
  fields: ['description'],
}))

useSeoMeta({
  title: article.value.seo?.title || article.value.title,
  description: article.value.seo?.description || article.value.description,
  ogType: 'article',
  ogImage: article.value.image?.src,
  articlePublishedTime: new Date(article.value.date).toISOString(),
  articleModifiedTime: article.value.updatedAt ? new Date(article.value.updatedAt).toISOString() : undefined,
})

useSchemaOrg([
  defineArticle({
    '@type': 'BlogPosting',
    'datePublished': new Date(article.value.date).toISOString(),
    'dateModified': article.value.updatedAt ? new Date(article.value.updatedAt).toISOString() : undefined,
    'image': article.value.image?.src,
  }),
])
</script>

<template>
  <ContentLayout
    v-if="article"
    :toc="article.body?.toc?.links"
  >
    <template #header>
      <PageMeta
        format="article"
        :tags="article.badge ? [article.badge.label] : []"
        :title="article.title"
        :description="article.description"
        :reading-time="readingTime(article.body)"
        :reviewed="article.updatedAt ?? article.date"
        :authors="resolveAuthors(article.authors)"
        :file="`${article.stem}.${article.extension}`"
        :breadcrumb="{ label: 'All articles', to: '/articles' }"
      >
        <p class="mf-meta">
          <time :datetime="isoDate(article.date)">Published {{ formatDate(article.date) }}</time>
        </p>
      </PageMeta>
    </template>

    <ContentRenderer
      :value="article"
      class="mf-prose"
    />

    <PageFooterLinks :file="`${article.stem}.${article.extension}`" />

    <UContentSurround
      :surround="surround ?? []"
      class="mf-no-print"
    />
  </ContentLayout>
</template>
