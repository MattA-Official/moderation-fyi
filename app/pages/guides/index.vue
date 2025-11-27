<template>
  <UPage>
    <UPageHeader
      title="Moderation Guides"
      description="Practical, in-depth guides for community moderators. Learn how to handle difficult situations, set up rules, and build a healthy community."
    />

    <UPageBody>
      <UPageGrid>
        <UPageCard
          v-for="guide in guides"
          :key="guide.path"
          :to="guide.path"
          :title="guide.title"
          :description="guide.description"
        />
      </UPageGrid>
    </UPageBody>
  </UPage>
</template>

<script setup lang="ts">
const { data: guides } = await useAsyncData('guides-list', () => {
  return queryCollection('guides')
    .order('publishedAt', 'DESC')
    .select('title', 'path', 'description')
    .all()
})

useSeoMeta({
  title: 'Guides',
  description: 'Practical, in-depth guides for community moderators.',
})
</script>
