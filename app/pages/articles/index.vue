<script setup lang="ts">
const { resolveAuthors } = await useAuthors()

const { data: articles } = await useAsyncData('articles-list', () => queryCollection('articles')
  .select('title', 'description', 'path', 'date', 'image', 'badge', 'authors')
  .order('date', 'DESC')
  .all())

useSeoMeta({
  title: 'Articles',
  description: 'News, case studies and opinion on community moderation and online safety.',
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Articles"
        description="Case studies, opinion and deeper dives into community moderation and online safety."
      >
        <template #links>
          <UButton
            to="/rss.xml"
            target="_blank"
            label="RSS feed"
            icon="i-lucide-rss"
            color="neutral"
            variant="subtle"
          />
        </template>
      </UPageHeader>

      <UPageBody>
        <UBlogPosts v-if="articles?.length">
          <UBlogPost
            v-for="(article, index) in articles"
            :key="article.path"
            :to="article.path"
            :title="article.title"
            :description="article.description"
            :image="article.image"
            :date="formatDate(article.date)"
            :authors="resolveAuthors(article.authors)"
            :badge="article.badge ? { ...article.badge, variant: 'subtle' } : undefined"
            :orientation="index === 0 ? 'horizontal' : 'vertical'"
            :class="[index === 0 && 'col-span-full']"
            variant="naked"
            :ui="{ description: 'line-clamp-2' }"
          />
        </UBlogPosts>

        <EmptyState
          v-else
          noun="articles"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
