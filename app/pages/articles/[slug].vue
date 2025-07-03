<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>

<script lang="ts" setup>
// Import only the necessary type
import type { UseHeadSafeInput } from '@unhead/vue'

const route = useRoute()

const { data: page } = await useAsyncData(`page-${route.path}`, () => {
  return queryCollection('articles').path(route.path).first()
})

definePageMeta({
  layout: 'article',
})

if (page.value?.ogImage) {
  defineOgImage(page.value?.ogImage) // <-- Nuxt OG Image
}

// Ensure the schema.org is rendered
if (page.value?.head) {
  const headData = page.value.head as unknown as UseHeadSafeInput
  useHeadSafe(headData) // <-- Nuxt Schema.org
}

if (page.value?.seo) {
  // Extract the SEO properties we need
  const { title, description } = page.value.seo

  // Create a properly typed object for useSeoMeta
  // Make sure to handle keywords specifically
  const keywords = page.value.seo.keywords
    ? Array.isArray(page.value.seo.keywords)
      ? page.value.seo.keywords.join(', ')
      : page.value.seo.keywords
    : undefined

  // Now pass the properly formatted data
  useSeoMeta({
    title,
    description,
    keywords,
  })
}
</script>
