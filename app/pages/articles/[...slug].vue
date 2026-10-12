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

const authors = computed(() => resolveAuthors(article.value?.authors))

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
  <UContainer v-if="article">
    <UPage>
      <UPageHeader
        :title="article.title"
        :description="article.description"
      >
        <template #headline>
          <UBreadcrumb :items="[{ label: 'Articles', to: '/articles', icon: 'i-lucide-newspaper' }]" />
          <span class="text-muted">&middot;</span>
          <UBadge
            v-if="article.badge"
            v-bind="article.badge"
            variant="subtle"
          />
          <time
            class="text-muted"
            :datetime="new Date(article.date).toISOString()"
          >{{ formatDate(article.date, 'long') }}</time>
        </template>

        <AuthorList
          :authors="authors"
          class="mt-6"
        />
      </UPageHeader>

      <UPageBody>
        <NuxtImg
          v-if="article.image?.src"
          :src="article.image.src"
          :alt="article.image.alt || ''"
          class="w-full rounded-lg aspect-[16/9] object-cover"
          width="1200"
          height="675"
        />

        <ContentRenderer :value="article" />

        <USeparator />

        <PageFooterLinks
          :file="`${article.stem}.${article.extension}`"
          :updated-at="article.updatedAt"
        />

        <UContentSurround :surround="surround ?? []" />
      </UPageBody>

      <template
        v-if="article.body?.toc?.links?.length"
        #right
      >
        <UContentToc
          :links="article.body.toc.links"
          title="On this page"
          highlight
        />
      </template>
    </UPage>
  </UContainer>
</template>
