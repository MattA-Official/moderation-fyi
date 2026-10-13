<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const notFound = computed(() => props.error.statusCode === 404)

useSeoMeta({
  title: notFound.value ? 'Page not found' : 'Something broke',
  robots: 'noindex',
})
</script>

<template>
  <UApp>
    <NuxtLayout>
      <div class="mx-auto max-w-page px-4 md:px-8 py-16 md:py-24">
        <div class="max-w-measure space-y-6">
          <h1 class="mf-h1">
            {{ notFound ? 'This page isn\'t here.' : 'Something broke on our end.' }}
          </h1>
          <p class="mf-lede">
            <template v-if="notFound">
              Either it never was, or it moved. Try the search, or browse the library — most things on the site can be found in two clicks.
            </template>
            <template v-else>
              It's not you. Try again in a minute, or search for what you were after.
            </template>
          </p>
          <SearchForm large />
          <div class="flex flex-wrap gap-3">
            <UButton
              label="Browse the guides"
              @click="clearError({ redirect: '/guides' })"
            />
            <UButton
              label="Go to the homepage"
              color="neutral"
              variant="outline"
              @click="clearError({ redirect: '/' })"
            />
          </div>
        </div>
      </div>
    </NuxtLayout>
  </UApp>
</template>
