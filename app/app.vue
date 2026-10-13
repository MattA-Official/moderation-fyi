<script setup lang="ts">
useHead({
  titleTemplate: title => title ? `${title} · moderation.fyi` : 'moderation.fyi',
})
</script>

<template>
  <UApp>
    <NuxtLoadingIndicator
      color="var(--mf-accent)"
      :height="2"
    />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
