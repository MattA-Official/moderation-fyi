<script setup lang="ts">
type Author = { name: string, to?: string, target?: string }

const props = defineProps<{
  format?: ContentFormat
  tags?: string[]
  title: string
  description?: string
  readingTime?: string
  /** Date shown as "Last reviewed May 2026" */
  reviewed?: string | Date
  authors?: Author[]
  /** Content file path relative to `content/` for "Edit this page" */
  file?: string
  breadcrumb?: { label: string, to: string }
}>()

const editLink = useEditLink(() => props.file)
const stale = computed(() => isStale(props.reviewed))
</script>

<template>
  <header class="border-b border-mf-rule pt-8 pb-6 sm:pt-12 space-y-4">
    <MfCallout
      v-if="stale && editLink"
      kind="stale"
      label="May be out of date"
      class="max-w-measure-wide"
    >
      <p>
        Last reviewed over a year ago — may be out of date. <NuxtLink
          :to="editLink"
          external
        >Want to refresh it?</NuxtLink>
      </p>
    </MfCallout>

    <NuxtLink
      v-if="breadcrumb"
      :to="breadcrumb.to"
      class="mf-link mf-link--quiet inline-flex items-center gap-1 font-sans text-sm"
    >
      <UIcon
        name="i-lucide-arrow-left"
        class="size-4"
        aria-hidden="true"
      />
      {{ breadcrumb.label }}
    </NuxtLink>

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

    <h1 class="mf-h1 max-w-measure-wide text-pretty">
      {{ title }}
    </h1>

    <p
      v-if="description"
      class="mf-lede max-w-measure-wide"
    >
      {{ description }}
    </p>

    <slot />

    <p
      v-if="readingTime || reviewed"
      class="mf-meta"
    >
      <span v-if="readingTime">{{ readingTime }}</span>
      <time
        v-if="reviewed"
        :datetime="isoDate(reviewed)"
      >Last reviewed {{ formatMonth(reviewed) }}</time>
    </p>

    <p
      v-if="authors?.length"
      class="mf-credit"
    >
      Written by
      <template
        v-for="(author, index) in authors"
        :key="author.name"
      >
        <span v-if="index > 0">{{ index === authors.length - 1 ? ' and ' : ', ' }}</span>
        <NuxtLink
          v-if="author.to"
          :to="author.to"
          :target="author.target"
        >{{ author.name }}</NuxtLink>
        <span v-else>{{ author.name }}</span>
      </template>.
    </p>

    <NuxtLink
      v-if="editLink"
      :to="editLink"
      external
      class="mf-edit"
    >
      <UIcon
        name="i-lucide-pencil"
        class="size-4"
        aria-hidden="true"
      />
      Edit this page
    </NuxtLink>
  </header>
</template>
