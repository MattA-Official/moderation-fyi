<script setup lang="ts">
const { data: templates } = await useAsyncData('templates-list', () => queryCollection('templates')
  .select('title', 'description', 'path', 'category', 'templateType', 'platforms', 'topics', 'authors', 'featured', 'publishedAt')
  .order('publishedAt', 'DESC')
  .all())

const optionLabel = await useFacetLabels()
const { search, filters, from, to, sort, sorts, results, options, filterCount, reset, active } = useResourceFilters(templates, ['topics', 'platforms', 'templateType', 'category', 'authors'], {
  labels: { category: 'Kind' },
  advanced: ['authors'],
  optionLabel,
  dateField: 'publishedAt',
  sorts: listingSorts,
})

useSeoMeta({
  title: 'Moderation templates: rules, ban messages and appeal forms',
  description: 'Free copy-and-paste moderation templates for Discord servers, subreddits and Twitch channels: server rules, removal reasons, ban messages, appeal forms and checklists.',
})
</script>

<template>
  <div class="mx-auto max-w-page px-4 md:px-8">
    <header class="border-b border-mf-rule pt-8 pb-6 sm:pt-12 space-y-4">
      <h1 class="mf-h1">
        Templates
      </h1>
      <p class="mf-lede max-w-measure-wide">
        Rules, removal reasons, ban messages and appeal forms. Copy one, fill in the bracketed bits and make it your own.
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
        noun="template"
        @reset="reset"
      />

      <div
        v-if="results.length"
        class="mf-grid"
      >
        <ResourceCard
          v-for="template in results"
          :key="template.path"
          :to="template.path"
          :title="template.title"
          :description="template.description"
          format="template"
          :tags="[humanise(template.templateType), ...(template.platforms ?? []).map(platformLabel)]"
        />
      </div>

      <EmptyState
        v-else
        :filtered="active"
        noun="templates"
        @reset="reset"
      />
    </div>
  </div>
</template>
