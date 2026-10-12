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
  <UContainer v-if="page">
    <UPage>
      <UPageHeader
        :title="page.title"
        :description="page.description"
      />

      <UPageBody>
        <ContentRenderer :value="page" />

        <USeparator />

        <PageFooterLinks
          :file="`${page.stem}.${page.extension}`"
          :updated-at="page.updatedAt"
        />
      </UPageBody>

      <template
        v-if="page.body?.toc?.links?.length"
        #right
      >
        <UContentToc
          :links="page.body.toc.links"
          title="On this page"
          highlight
        />
      </template>
    </UPage>
  </UContainer>
</template>
