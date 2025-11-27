<template>
  <UPage>
    <UPageHeader
      title="Moderation Templates"
      description="Copy-paste templates for common moderation scenarios. From removal reasons to ban appeals, we've got you covered."
    />

    <UPageBody>
      <UPageGrid>
        <UPageCard
          v-for="template in templates"
          :key="template.path"
          :to="template.path"
          :title="template.title"
          :description="template.description"
        />
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
const { data: templates } = await useAsyncData('templates-list', () => {
  return queryCollection('templates')
    .order('publishedAt', 'DESC')
    .select('title', 'path', 'description')
    .all()
})

useSeoMeta({
  title: 'Templates',
  description: 'Copy-paste templates for common moderation scenarios.',
})
</script>
