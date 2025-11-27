<script setup lang="ts">
import type { FooterColumn } from '@nuxt/ui';

const columns: FooterColumn[] = [{
  label: 'Resources',
  children: [{
    label: 'Guides',
    to: '/guides'
  }, {
    label: 'Templates',
    to: '/templates'
  }, {
    label: 'Articles',
    to: '/articles'
  }]
}, {
  label: 'Community',
  children: [{
    label: 'Discord',
    to: 'https://discord.com',
    target: '_blank'
  }, {
    label: 'GitHub',
    to: 'https://github.com',
    target: '_blank'
  }]
}, {
  label: 'Legal',
  children: [{
    label: 'Privacy Policy',
    to: '#'
  }, {
    label: 'Terms of Service',
    to: '#'
  }]
}]

const socialLinks = [{
  icon: 'i-simple-icons-github',
  to: 'https://github.com',
  target: '_blank',
  'aria-label': 'GitHub'
}, {
  icon: 'i-simple-icons-x',
  to: 'https://x.com',
  target: '_blank',
  'aria-label': 'X'
}, {
  icon: 'i-simple-icons-discord',
  to: 'https://discord.com',
  target: '_blank',
  'aria-label': 'Discord'
}]
</script>

<template>
  <UFooter>
    <template #top>
      <UContainer>
        <UFooterColumns :columns="columns">
          <!-- <template #right>
            <UFormField name="email" label="Subscribe to our newsletter" size="lg">
              <UInput type="email" class="w-full">
                <template #trailing>
                  <UButton type="submit" size="xs" color="neutral" label="Subscribe" />
                </template>
</UInput>
</UFormField>
</template> -->
        </UFooterColumns>
      </UContainer>
    </template>

    <template #left>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        Copyright © {{ new Date().getFullYear() }} moderation.fyi. All rights reserved.
      </p>
    </template>

    <template #right>
      <UButton v-for="link in socialLinks" :key="link.icon" v-bind="link" color="neutral" variant="ghost" />
    </template>
  </UFooter>
</template>