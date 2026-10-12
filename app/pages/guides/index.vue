<script setup lang="ts">
const { data: guides } = await useAsyncData('guides-list', () => queryCollection('guides')
  .select('title', 'description', 'path', 'category', 'difficulty', 'estimatedTime', 'platforms', 'tags', 'featured', 'publishedAt')
  .order('featured', 'DESC')
  .order('publishedAt', 'DESC')
  .all())

const { search, filters, results, options, reset, active } = useResourceFilters(guides, ['category', 'difficulty', 'platforms'])

useSeoMeta({
  title: 'Guides',
  description: 'Practical, step-by-step guides for volunteer community moderators. Learn how to write rules, handle difficult situations and build a healthy community.',
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Moderation guides"
        description="Practical, step-by-step guides for volunteer community moderators. Learn how to handle difficult situations, write good rules and build a healthy community."
      />

      <UPageBody>
        <ResourceFilters
          v-model:search="search"
          v-model:filters="filters"
          :options="options"
          :active="active"
          :count="results.length"
          noun="guide"
          @reset="reset"
        />

        <UPageGrid v-if="results.length">
          <ResourceCard
            v-for="guide in results"
            :key="guide.path"
            :to="guide.path"
            :title="guide.title"
            :description="guide.description"
            :category="guide.category"
            :difficulty="guide.difficulty"
            :estimated-time="guide.estimatedTime"
            :platforms="guide.platforms"
          />
        </UPageGrid>

        <EmptyState
          v-else
          :filtered="active"
          noun="guides"
          @reset="reset"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
