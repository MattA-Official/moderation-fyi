<script setup lang="ts">
const { data: templates } = await useAsyncData('templates-list', () => queryCollection('templates')
  .select('title', 'description', 'path', 'category', 'templateType', 'platforms', 'tags', 'featured', 'publishedAt')
  .order('featured', 'DESC')
  .order('publishedAt', 'DESC')
  .all())

const { search, filters, results, options, reset, active } = useResourceFilters(templates, ['category', 'templateType', 'platforms'])

useSeoMeta({
  title: 'Templates',
  description: 'Free copy-and-paste templates for community moderators: server rules, removal reasons, ban appeals, onboarding checklists and more.',
})
</script>

<template>
  <UContainer>
    <UPage>
      <UPageHeader
        title="Moderation templates"
        description="Copy-and-paste templates for common moderation tasks. From server rules and removal reasons to ban appeals and onboarding checklists, adapt them to fit your community."
      />

      <UPageBody>
        <ResourceFilters
          v-model:search="search"
          v-model:filters="filters"
          :options="options"
          :active="active"
          :count="results.length"
          noun="template"
          @reset="reset"
        />

        <UPageGrid v-if="results.length">
          <ResourceCard
            v-for="template in results"
            :key="template.path"
            :to="template.path"
            :title="template.title"
            :description="template.description"
            :category="template.category"
            :type="template.templateType"
            :platforms="template.platforms"
            icon="i-lucide-file-text"
          />
        </UPageGrid>

        <EmptyState
          v-else
          :filtered="active"
          noun="templates"
          @reset="reset"
        />
      </UPageBody>
    </UPage>
  </UContainer>
</template>
