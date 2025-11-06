<template>
  <UContainer v-if="article">
    <UPageHeader
      :title="article.title"
      :description="article.description"
    >
      <template #headline>
        <UBadge
          v-bind="article.badge"
          variant="subtle"
        />
        <span class="text-muted">&middot;</span>
        <time class="text-muted">{{ new Date(article.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' }) }}</time>
      </template>

      <div class="flex flex-wrap items-center gap-3 mt-4">
        <UButton
          v-for="(author, index) in article.authors"
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
          v-if="article"
          :value="article"
        />

        <USeparator v-if="surround?.length" />

        <UContentSurround :surround="surround" />
      </UPageBody>

      <template
        v-if="article?.body?.toc?.links?.length"
        #right
      >
        <UContentToc :links="article.body.toc.links" />
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

const { data: surround } = await useAsyncData(`${route.path}-surround`, () => {
  return queryCollectionItemSurroundings('articles', route.path, {
    fields: ['description'],
  })
})

const title = article.value.seo?.title || article.value.title
const description = article.value.seo?.description || article.value.description

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
})

if (article.value.image?.src) {
  defineOgImage({
    url: article.value.image.src,
  })
}
else {
  defineOgImageComponent('Saas', {
    headline: 'Blog',
  })
}
</script>
