<template>
  <ContentRenderer
    v-if="page"
    :value="page"
  />
</template>

<script lang="ts" setup>
const route = useRoute()

const { data: page } = await useAsyncData(route.path, () => {
  return queryCollection('articles').path(route.path).first()
})

definePageMeta({
  layout: 'article',
})
</script>
