<template>
  <main>
    <NuxtLink
      v-for="guide in guides"
      :key="guide.path"
      :to="guide.path"
    >
      <h2>{{ guide.title }}</h2>
      <p>{{ guide.description }}</p>
    </NuxtLink>
  </main>
</template>

<script setup lang="ts">
const { data: guides } = await useAsyncData('guides-list', () => {
  return queryCollection('guides')
    .order('publishedAt', 'DESC')
    .select('title', 'path', 'description')
    .all()
})
</script>
