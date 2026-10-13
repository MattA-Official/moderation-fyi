<script setup lang="ts">
import type { TocLink } from '@nuxt/content'

defineProps<{
  toc?: TocLink[]
}>()
</script>

<template>
  <div class="mx-auto max-w-page px-4 md:px-8">
    <slot name="header" />

    <div class="grid gap-10 lg:grid-cols-[minmax(0,1fr)_15rem] py-8">
      <div class="min-w-0 space-y-8">
        <slot />
      </div>

      <aside
        v-if="toc?.length || $slots.aside"
        class="mf-no-print"
      >
        <div class="lg:sticky lg:top-6 space-y-6">
          <slot name="aside" />
          <UContentToc
            v-if="toc?.length"
            class="hidden lg:block"
            :links="toc"
            title="On this page"
            highlight
            highlight-color="primary"
          />
        </div>
      </aside>
    </div>
  </div>
</template>
