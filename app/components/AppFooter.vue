<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui'

const { site } = useAppConfig()

const columns: FooterColumn[] = [{
  label: 'Resources',
  children: [
    { label: 'Guides', to: '/guides' },
    { label: 'Templates', to: '/templates' },
    { label: 'Articles', to: '/articles' },
    { label: 'RSS feed', to: '/rss.xml', target: '_blank' },
  ],
}, {
  label: 'Project',
  children: [
    { label: 'About', to: '/about' },
    { label: 'Contribute', to: '/contribute' },
    { label: 'GitHub', to: site.repository, target: '_blank' },
  ],
}, {
  label: 'Legal',
  children: [
    { label: 'Privacy policy', to: '/privacy' },
    { label: 'Terms of use', to: '/terms' },
  ],
}]
</script>

<template>
  <USeparator
    icon="i-lucide-shield"
    class="h-px"
  />

  <UFooter :ui="{ top: 'border-b border-default' }">
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <template #right>
            <NewsletterForm compact />
          </template>
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-muted text-sm">
        © {{ new Date().getFullYear() }} moderation.fyi · Built by moderators, for moderators.
      </p>
    </template>

    <template #right>
      <UButton
        v-for="link in site.socials"
        :key="link.to"
        :icon="link.icon"
        :to="link.to"
        :aria-label="link.label"
        target="_blank"
        color="neutral"
        variant="ghost"
      />
    </template>
  </UFooter>
</template>
