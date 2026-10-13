<script setup lang="ts">
const { data: articles } = await useAsyncData('articles-list', () => queryCollection('articles')
  .select('title', 'description', 'path', 'date', 'badge', 'authors', 'topics', 'platforms')
  .order('date', 'DESC')
  .all(), {
  // The badge ("Study", "Opinion") doubles as the article's type filter
  transform: articles => articles.map(article => ({ ...article, kind: article.badge?.label })),
})

const optionLabel = await useFacetLabels()
const { search, filters, from, to, sort, sorts, results, options, filterCount, reset, active } = useResourceFilters(articles, ['topics', 'platforms', 'kind', 'authors'], {
  labels: { kind: 'Type' },
  advanced: ['authors'],
  optionLabel,
  dateField: 'date',
  sorts: listingSorts,
})

useSeoMeta({
  title: 'Articles on community moderation',
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

    <div class="py-8 space-y-8">
      <ResourceFilters
        v-model:search="search"
        v-model:filters="filters"
        v-model:from="from"
        v-model:to="to"
        v-model:sort="sort"
        :options="options"
        :sorts="sorts"
        :active="active"
        :filter-count="filterCount"
        :count="results.length"
        date-label="Published"
        noun="article"
        @reset="reset"
      />

      <div
        v-if="results.length"
        class="mf-grid"
      >
        <ResourceCard
          v-for="article in results"
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
        :filtered="active"
        noun="articles"
        @reset="reset"
      />
    </div>
  </div>
</template>
