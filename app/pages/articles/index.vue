<script setup lang="ts">
const route = useRoute()

const { data: articles } = await useAsyncData(route.path, () => queryCollection('articles').all())
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

// Transform articles to include resolved author data
const enrichedArticles = computed(() => {
  if (!articles.value) return []

  return articles.value.map((article) => {
    // Map author IDs to full author objects
    const authorsData = (article.authors as string[] | undefined)?.map((authorId: string) => {
      return authorMap.value[authorId]
    }).filter((author): author is Author => author !== undefined) || []

    return {
      ...article,
      authors: authorsData,
    }
  })
})

// useSeoMeta({
//   title,
//   ogTitle: title,
//   description,
//   ogDescription: description
// })

// defineOgImageComponent('Saas')
</script>

<template>
  <UPage>
    <UPageHeader
      title="Articles"
      description="Stay updated with the latest news, insights, and trends in content moderation and online safety."
    />

    <UPageBody>
      <UBlogPosts>
        <UBlogPost
          v-for="(article, index) in enrichedArticles"
          :key="index"
          :to="article.path"
          :title="article.title"
          :description="article.description"
          :image="article.image"
          :date="new Date(article.date).toLocaleDateString('en', { year: 'numeric', month: 'short', day: 'numeric' })"
          :authors="article.authors"
          :badge="article.badge"
          :orientation="index === 0 ? 'horizontal' : 'vertical'"
          :class="[index === 0 && 'col-span-full']"
          variant="naked"
          :ui="{
            description: 'line-clamp-2',
          }"
        />
      </UBlogPosts>
    </UPageBody>
  </UPage>
</template>
