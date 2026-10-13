<script setup lang="ts">
const { site } = useAppConfig()

const columns = [{
  label: 'Library',
  links: [
    { label: 'Guides', to: '/guides' },
    { label: 'Templates', to: '/templates' },
    { label: 'Articles', to: '/articles' },
    { label: 'RSS feed', to: '/rss.xml', external: true },
  ],
}, {
  label: 'Project',
  links: [
    { label: 'About', to: '/about' },
    { label: 'Contribute', to: '/contribute' },
    { label: 'GitHub', to: site.repository, external: true },
  ],
}, {
  label: 'Legal',
  links: [
    { label: 'Privacy policy', to: '/privacy' },
    { label: 'Terms of use', to: '/terms' },
  ],
}]
</script>

<template>
  <footer class="bg-mf-paper-sunken border-t border-mf-rule mt-16 mf-no-print">
    <div class="mx-auto max-w-page px-4 md:px-8 py-12 grid gap-10 md:grid-cols-[1fr_2fr]">
      <div class="space-y-3">
        <NuxtLink to="/">
          <AppLogo />
        </NuxtLink>
        <p class="font-serif text-base/[26px] text-mf-ink max-w-xs">
          Practical moderation guides, written by mods who've done the job. Free and open source.
        </p>
      </div>

      <div class="grid gap-8 sm:grid-cols-3">
        <div
          v-for="column in columns"
          :key="column.label"
        >
          <h2 class="font-sans font-bold text-sm text-mf-ink mb-2">
            {{ column.label }}
          </h2>
          <ul>
            <li
              v-for="link in column.links"
              :key="link.to"
            >
              <a
                v-if="link.external"
                :href="link.to"
                class="mf-link mf-link--quiet inline-flex items-center min-h-11 font-sans text-base"
              >{{ link.label }}</a>
              <NuxtLink
                v-else
                :to="link.to"
                class="mf-link mf-link--quiet inline-flex items-center min-h-11 font-sans text-base"
              >
                {{ link.label }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div class="border-t border-mf-rule">
      <div class="mx-auto max-w-page px-4 md:px-8 py-4 flex flex-wrap justify-between gap-2 font-sans text-sm text-mf-ink-muted">
        <p>© {{ new Date().getFullYear() }} moderation.fyi</p>
        <p class="inline-flex items-center gap-1.5">
          Made with
          <UIcon
            name="i-lucide-heart"
            class="size-4 text-mf-accent"
            aria-label="care"
          />
          by volunteer mods, usually after midnight.
        </p>
      </div>
    </div>
  </footer>
</template>
