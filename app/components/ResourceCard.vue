<script setup lang="ts">
defineProps<{
  to: string
  title: string
  description?: string
  format?: ContentFormat
  /** Shown after the format pill: platforms, difficulty, type */
  tags?: string[]
  /** A meta line instead of tags, e.g. a date */
  meta?: string
}>()
</script>

<template>
  <article class="mf-card">
    <h3 class="mf-card__title">
      <NuxtLink :to="to">
        {{ title }}
      </NuxtLink>
    </h3>
    <p
      v-if="description"
      class="mf-card__desc line-clamp-3"
    >
      {{ description }}
    </p>
    <p
      v-if="meta"
      class="mf-card__meta"
    >
      {{ meta }}
    </p>
    <ul
      v-if="format || tags?.length"
      class="mf-pills"
    >
      <li
        v-if="format"
        class="mf-pill mf-pill--format"
      >
        <UIcon
          :name="formatIcons[format]"
          class="size-3.5"
          aria-hidden="true"
        />
        {{ formatLabels[format] }}
      </li>
      <li
        v-for="tag in tags"
        :key="tag"
        class="mf-pill"
      >
        {{ tag }}
      </li>
    </ul>
  </article>
</template>
