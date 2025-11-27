<template>
  <UContainer v-if="enrichedArticle">
    <UPageHeader
      :title="enrichedArticle.title"
      :description="enrichedArticle.description"
    >
      <template #headline>
        <UBadge
          v-bind="enrichedArticle.badge"
          variant="subtle"
        />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(enrichedArticle.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in enrichedArticle.authors"
          :key="index"
          :to="author.to"
          color="neutral"
          variant="subtle"
          target="_blank"
          size="sm"
        >
          <UAvatar
            v-bind="author.avatar"
            alt="Author avatar"
            size="2xs"
          />

          {{ author.name }}
        </UButton>
      </div>
    </UPageHeader>

    <UPage>
      <UPageBody>
        <ContentRenderer
          v-if="enrichedArticle"
          :value="enrichedArticle"
        />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template
        v-if="enrichedArticle?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="enrichedArticle.body.toc.links" />
      </template>
    </UPage>
  </UContainer>
</template>

<script setup lang="ts">
const route = useRoute()

const { data: article } = await useAsyncData(route.path, () => queryCollection('articles').path(route.path).first())
if (!article.value) {
  throw createError({ statusCode: 404, statusMessage: 'Article not found', fatal: true })
}

const { data: authors } = await useAsyncData('authors', () => queryCollection('authors').all())

type Author = NonNullable<typeof authors.value>[number]

// Create a map of author IDs to author objects for easy lookup
const authorMap = computed(() => {
  if (!authors.value) return {}
  return authors.value.reduce((map, author) => {
    // Extract the author ID from the stem (e.g., "moderation-team" from "authors/moderation-team")
    const authorId = author.stem?.replace('authors/', '')
    if (authorId) {
      map[authorId] = author
    }
    return map
  }, {} as Record<string, Author>)
})

// Resolve author data for the article
const enrichedArticle = computed(() => {
  if (!article.value) return null

  // Map author IDs to full author objects
  const authorsData = (article.value.authors as string[] | undefined)?.map((authorId: string) => {
    return authorMap.value[authorId]
  }).filter((author): author is Author => author !== undefined) || []

  return {
    ...article.value,
    authors: authorsData,
  }
})

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('articles', route.path, {
    fields: ['description'],
  })
})

const title = enrichedArticle.value?.seo?.title || enrichedArticle.value?.title
const description = enrichedArticle.value?.seo?.description || enrichedArticle.value?.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

if (enrichedArticle.value?.image?.src) {
  defineOgImage({
    url: enrichedArticle.value.image.src,
  })
}
else {
  defineOgImageComponent('Saas', {
    headline: 'Blog',
  })
}
</script>
