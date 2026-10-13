<script setup lang="ts">
const site = useSiteConfig()

useHead({
  titleTemplate: title => title ? `${title} · moderation.fyi` : 'moderation.fyi',
})

// Defaults for every page; pages override title, description and image
useSeoMeta({
  ogImage: `${site.url}/og-image.png`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageType: 'image/png',
  ogImageAlt: 'moderation.fyi: Moderation, written by people who\'ve done it.',
  twitterCard: 'summary_large_image',
  twitterImage: `${site.url}/og-image.png`,
  twitterImageAlt: 'moderation.fyi: Moderation, written by people who\'ve done it.',
})

useSchemaOrg([
  defineWebSite({
    name: 'moderation.fyi',
    description: 'Free, open-source moderation guides and templates for volunteer moderators on Discord, Reddit, Twitch and beyond.',
    inLanguage: 'en-GB',
    potentialAction: [
      defineSearchAction({ target: '/search?q={search_term_string}' }),
    ],
  }),
])
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
