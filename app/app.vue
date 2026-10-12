<script setup lang="ts">
import type { ContentNavigationItem } from '@nuxt/content'

useHead({
  titleTemplate: title => title ? `${title} · moderation.fyi` : 'moderation.fyi',
})

const { data: navigation } = useLazyAsyncData('search-navigation', async () => {
  const [guides, templates, articles] = await Promise.all([
    queryCollectionNavigation('guides'),
    queryCollectionNavigation('templates'),
    queryCollectionNavigation('articles'),
  ])
  return [
    { title: 'Guides', path: '/guides', icon: 'i-lucide-book-open', children: guides.flatMap(item => item.children ?? [item]) },
    { title: 'Templates', path: '/templates', icon: 'i-lucide-files', children: templates.flatMap(item => item.children ?? [item]) },
    { title: 'Articles', path: '/articles', icon: 'i-lucide-newspaper', children: articles.flatMap(item => item.children ?? [item]) },
  ] satisfies ContentNavigationItem[]
}, { server: false })

const { data: files } = useLazyAsyncData('search-sections', async () => {
  const sections = await Promise.all([
    queryCollectionSearchSections('guides'),
    queryCollectionSearchSections('templates'),
    queryCollectionSearchSections('articles'),
  ])
  return sections.flat()
}, { server: false })

const links = [
  { label: 'Guides', to: '/guides', icon: 'i-lucide-book-open' },
  { label: 'Templates', to: '/templates', icon: 'i-lucide-files' },
  { label: 'Articles', to: '/articles', icon: 'i-lucide-newspaper' },
  { label: 'Contribute', to: '/contribute', icon: 'i-lucide-git-pull-request' },
]
</script>

<template>
  <UApp :toaster="{ position: 'bottom-right' }">
    <NuxtLoadingIndicator color="var(--ui-primary)" />

    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <ClientOnly>
      <LazyUContentSearch
        :files="files"
        :navigation="navigation"
        :links="links"
        :fuse="{ resultLimit: 42 }"
        placeholder="Search guides, templates and articles…"
      />
    </ClientOnly>
  </UApp>
</template>
