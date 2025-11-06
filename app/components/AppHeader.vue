<template>
  <UHeader>
    <template #title>
      <AppLogo class="h-6 w-auto" />
    </template>

    <UNavigationMenu :items="items" />

    <template #right>
      <UColorModeButton />

      <UTooltip
        text="Open on GitHub"
        :kbds="['meta', 'G']"
      >
        <UButton
          color="neutral"
          variant="ghost"
          to="https://github.com/nuxt/ui"
          target="_blank"
          icon="i-simple-icons-github"
          aria-label="GitHub"
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

<script lang="ts" setup>
import type { NavigationMenuItem } from '@nuxt/ui'

const route = useRoute()

const items = computed<NavigationMenuItem[]>(() => [
  {
    label: 'Explore Guides',
    to: '/guides',
    active: route.path.startsWith('/guides'),
  },
  {
    label: 'Read Articles',
    to: '/articles',
    active: route.path.startsWith('/articles'),
  },
  {
    label: 'Browse Templates',
    to: '/templates',
    active: route.path.startsWith('/templates'),
  },
])
</script>

<style scoped>

</style>
