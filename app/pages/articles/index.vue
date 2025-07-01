<template>
  <main>
    <NuxtLink
      v-for="article in articles"
      :key="article.path"
      :to="article.path"
    >
      <h2>{{ article.title }}</h2>
      <p>{{ article.description }}</p>
    </NuxtLink>
  </main>
</template>

<script setup lang="ts">
const { data: articles } = await useAsyncData('articles-list', () => {
  return queryCollection('articles')
    .order('publishedAt', 'DESC')
    .select('title', 'path', 'description')
    .all()
})
</script>
