<script setup lang="ts">
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()
const { site } = useAppConfig()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Guides',
    to: '/guides',
    icon: 'i-lucide-book-open',
    active: route.path.startsWith('/guides'),
  },
  {
    label: 'Templates',
    to: '/templates',
    icon: 'i-lucide-files',
    active: route.path.startsWith('/templates'),
  },
  {
    label: 'Articles',
    to: '/articles',
    icon: 'i-lucide-newspaper',
    active: route.path.startsWith('/articles'),
  },
  {
    label: 'Contribute',
    to: '/contribute',
    icon: 'i-lucide-git-pull-request',
  },
])
</script>

<template>
  <UHeader :to="'/'">
    <template #title>
      <AppLogo />
    </template>

    <UNavigationMenu
      :items="items"
      variant="link"
      :ui="{ linkLeadingIcon: 'hidden' }"
    />

    <template #right>
      <UContentSearchButton :collapsed="true" />

      <UColorModeButton />

      <UTooltip text="Open on GitHub">
        <UButton
          color="neutral"
          variant="ghost"
          :to="site.repository"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="moderation.fyi on GitHub"
        />
      </UTooltip>
    </template>

    <template #body>
      <UNavigationMenu
        :items="items"
        orientation="vertical"
        class="-mx-2.5"
      />
    </template>
  </UHeader>
</template>
