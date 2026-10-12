<script setup lang="ts">
defineProps<{
  authors: { name: string, description?: string, avatar: { src: string, alt?: string }, to?: string, target?: string }[]
}>()
</script>

<template>
  <div
    v-if="authors.length"
    class="flex flex-wrap items-center gap-x-6 gap-y-3"
  >
    <UUser
      v-for="author in authors"
      :key="author.name"
      :name="author.name"
      :avatar="{ ...author.avatar, icon: 'i-lucide-user' }"
      :to="author.to"
      :target="author.target"
      size="md"
    />
  </div>
</template>
