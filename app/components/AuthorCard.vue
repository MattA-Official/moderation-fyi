<script setup lang="ts">
defineProps<{
  name: string
  to: string
  description?: string
  pronouns?: string
  avatar?: { src?: string, alt?: string }
  /** Links to the author's own site rather than a bio page */
  external?: boolean
  /** e.g. "3 pieces" */
  meta?: string
}>()
</script>

<template>
  <article class="mf-card">
    <div class="flex items-center gap-4">
      <UAvatar
        :src="avatar?.src"
        :alt="avatar?.alt || name"
        size="3xl"
        class="shrink-0 bg-mf-accent-soft text-mf-accent font-sans font-bold"
      />
      <div class="min-w-0">
        <h2 class="mf-card__title">
          <NuxtLink :to="to">
            {{ name }}
          </NuxtLink>
          <UIcon
            v-if="external"
            name="i-lucide-external-link"
            class="size-4 ms-1.5 align-[-1px] text-mf-ink-muted"
            aria-label="(external site)"
          />
        </h2>
        <p
          v-if="pronouns"
          class="mf-card__meta"
        >
          {{ pronouns }}
        </p>
      </div>
    </div>
    <p
      v-if="description"
      class="mf-card__desc"
    >
      {{ description }}
    </p>
    <p
      v-if="meta"
      class="mf-card__meta mt-auto"
    >
      {{ meta }}
    </p>
  </article>
</template>
