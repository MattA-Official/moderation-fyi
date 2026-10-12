<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({
  title: props.error.statusCode === 404 ? 'Page not found' : 'Something went wrong',
  robots: 'noindex',
})
</script>

<template>
  <UApp>
    <AppHeader />

    <UMain>
      <UContainer>
        <UError
          :error="error"
          :clear="{ label: 'Back to the homepage', icon: 'i-lucide-house', size: 'lg' }"
          redirect="/"
        />
      </UContainer>
    </UMain>

    <AppFooter />
  </UApp>
</template>
