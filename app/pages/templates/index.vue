<template>
  <main>
    <NuxtLink
      v-for="template in templates"
      :key="template.path"
      :to="template.path"
    >
      <h2>{{ template.title }}</h2>
      <p>{{ template.description }}</p>
    </NuxtLink>
  </main>
</template>

<script setup lang="ts">
const { data: templates } = await useAsyncData('templates-list', () => {
  return queryCollection('templates')
    .order('publishedAt', 'DESC')
    .select('title', 'path', 'description')
    .all()
})
</script>
