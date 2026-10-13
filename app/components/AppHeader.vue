<script setup lang="ts">
const route = useRoute()

const links = [
  { label: 'Guides', to: '/guides' },
  { label: 'Templates', to: '/templates' },
  { label: 'Articles', to: '/articles' },
  { label: 'Contribute', to: '/contribute' },
  { label: 'About', to: '/about' },
]

function isCurrent(to: string) {
  return route.path === to || route.path.startsWith(`${to}/`)
}
</script>

<template>
  <header class="mf-topbar bg-mf-paper border-b border-mf-rule">
    <div class="mx-auto max-w-page px-4 md:px-8 py-3 flex flex-wrap md:flex-nowrap items-center gap-x-6 gap-y-1">
      <NuxtLink
        to="/"
        class="me-auto md:me-0 py-2.5"
      >
        <AppLogo />
      </NuxtLink>

      <nav
        aria-label="Main"
        class="order-3 md:order-none w-full md:w-auto md:me-auto"
      >
        <ul class="flex flex-wrap gap-x-4">
          <li
            v-for="link in links"
            :key="link.to"
          >
            <NuxtLink
              :to="link.to"
              :aria-current="isCurrent(link.to) ? 'page' : undefined"
              class="inline-flex items-center min-h-11 font-sans text-base border-b-2 border-transparent hover:border-mf-rule-strong aria-[current=page]:font-bold aria-[current=page]:text-mf-accent aria-[current=page]:border-mf-accent"
              :class="isCurrent(link.to) ? '' : 'text-mf-ink'"
            >
              {{ link.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="flex items-center gap-1 order-2 md:order-none">
        <UColorModeButton
          color="neutral"
          variant="ghost"
        />
      </div>

      <div class="order-4 md:order-none w-full md:w-64 pb-2 md:pb-0">
        <SearchForm />
      </div>
    </div>
  </header>
</template>
