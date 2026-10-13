<script setup lang="ts">
const { data: articles } = await useAsyncData('articles-list', () => queryCollection('articles')
  .select('title', 'description', 'path', 'date', 'badge', 'authors')
  .order('date', 'DESC')
  .all())

useSeoMeta({
  title: 'Articles',
  description: 'Case studies, opinion and longer reads on community moderation and online safety, from mods who\'ve been there.',
})
</script>

<template>
  <div class="mx-auto max-w-page px-4 md:px-8">
    <header class="border-b border-mf-rule pt-8 pb-6 sm:pt-12 space-y-4">
      <h1 class="mf-h1">
        Articles
      </h1>
      <p class="mf-lede max-w-measure-wide">
        Longer reads: what other mod teams tried, what worked, and what they'd do differently.
      </p>
      <NuxtLink
        to="/rss.xml"
        external
        class="mf-link mf-link--quiet inline-flex items-center gap-2 min-h-11 font-sans text-sm"
      >
        <UIcon
          name="i-lucide-rss"
          class="size-4"
          aria-hidden="true"
        />
        Follow by RSS
      </NuxtLink>
    </header>

    <div class="py-8">
      <div
        v-if="articles?.length"
        class="mf-grid"
      >
        <ResourceCard
          v-for="article in articles"
          :key="article.path"
          :to="article.path"
          :title="article.title"
          :description="article.description"
          format="article"
          :tags="article.badge ? [article.badge.label] : []"
          :meta="formatDate(article.date)"
        />
      </div>

      <EmptyState
        v-else
        noun="articles"
      />
    </div>
  </div>
</template>
