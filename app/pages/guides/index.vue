<script setup lang="ts">
const { data: guides } = await useAsyncData('guides-list', () => queryCollection('guides')
  .select('title', 'description', 'path', 'category', 'difficulty', 'platforms', 'topics', 'authors', 'featured', 'publishedAt')
  .order('publishedAt', 'DESC')
  .all())

const optionLabel = await useFacetLabels()
const { search, filters, from, to, sort, sorts, results, options, filterCount, reset, active } = useResourceFilters(guides, ['topics', 'platforms', 'difficulty', 'category', 'authors'], {
  labels: { category: 'Section' },
  advanced: ['authors'],
  optionLabel,
  dateField: 'publishedAt',
  sorts: listingSorts,
})

useSeoMeta({
  title: 'Moderation guides for Discord, Reddit and Twitch',
  description: 'Free step-by-step moderation guides for volunteer mods: writing server rules, handling raids, de-escalating conflict and running a mod team.',
})
</script>

<template>
  <div class="mx-auto max-w-page px-4 md:px-8">
    <header class="border-b border-mf-rule pt-8 pb-6 sm:pt-12 space-y-4">
      <h1 class="mf-h1">
        Guides
      </h1>
      <p class="mf-lede max-w-measure-wide">
        Step-by-step answers to the situations mods actually face. Each one starts with a short version you can follow straight away.
      </p>
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
        noun="guide"
        @reset="reset"
      />

      <div
        v-if="results.length"
        class="mf-grid"
      >
        <ResourceCard
          v-for="guide in results"
          :key="guide.path"
          :to="guide.path"
          :title="guide.title"
          :description="guide.description"
          format="guide"
          :tags="[...(guide.platforms ?? []).map(platformLabel), difficultyLabels[guide.difficulty]]"
        />
      </div>

      <EmptyState
        v-else
        :filtered="active"
        noun="guides"
        @reset="reset"
      />
    </div>
  </div>
</template>
