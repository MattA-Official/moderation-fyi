<script setup lang="ts">
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => queryCollection('pages').path(route.path).first())
if (!page.value) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found', fatal: true })
}

useSeoMeta({
  title: page.value.seo?.title || page.value.title,
  description: page.value.seo?.description || page.value.description,
})
</script>

<template>
  <ContentLayout
    v-if="page"
    :toc="page.body?.toc?.links"
  >
    <template #header>
      <PageMeta
        :title="page.title"
        :description="page.description"
        :reviewed="page.updatedAt"
        :file="`${page.stem}.${page.extension}`"
      />
    </template>

    <ContentRenderer
      :value="page"
      class="mf-prose"
    />

    <PageFooterLinks :file="`${page.stem}.${page.extension}`" />
  </ContentLayout>
</template>
