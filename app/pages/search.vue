<script setup lang="ts">
const route = useRoute()
const query = computed(() => (typeof route.query.q === 'string' ? route.query.q : '').trim())

const collections = [
  { name: 'guides', format: 'guide' },
  { name: 'templates', format: 'template' },
  { name: 'articles', format: 'article' },
] as const

const { data: sections } = await useAsyncData('search-sections', async () => {
  const results = await Promise.all(collections.map(async ({ name, format }) => {
    const items = await queryCollectionSearchSections(name)
    return items.map(item => ({ ...item, format }))
  }))
  return results.flat()
})

function pageOf(id: string) {
  return id.split('#')[0]!
}

// Group matching sections by page; pages whose title matches come first
const results = computed(() => {
  const words = query.value.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) return []

  const pages = new Map<string, { path: string, title: string, format: ContentFormat, score: number, snippets: { id: string, heading: string, text: string }[] }>()
  for (const section of sections.value ?? []) {
    const haystack = [section.title, ...section.titles, section.content].join(' ').toLowerCase()
    if (!words.every(word => haystack.includes(word))) continue

    const path = pageOf(section.id)
    const page = pages.get(path) ?? { path, title: section.titles[0] ?? section.title, format: section.format, score: 0, snippets: [] }
    if (section.id === path) {
      page.title = section.title
      page.score += 10
    }
    page.score += 1
    if (page.snippets.length < 2 && section.content) {
      page.snippets.push({ id: section.id, heading: section.id === path ? '' : section.title, text: excerpt(section.content, words) })
    }
    pages.set(path, page)
  }
  return [...pages.values()].sort((a, b) => b.score - a.score)
})

function excerpt(text: string, words: string[]) {
  const lower = text.toLowerCase()
  const at = Math.max(0, Math.min(...words.map(word => lower.indexOf(word)).filter(index => index >= 0)) - 60)
  const slice = text.slice(at, at + 200)
  return `${at > 0 ? '…' : ''}${slice}${at + 200 < text.length ? '…' : ''}`
}

/** Splits text into parts so matched words can be wrapped in <mark> */
function highlight(text: string) {
  const words = query.value.split(/\s+/).filter(Boolean).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  if (!words.length) return [{ text, match: false }]
  // With a capture group, split() puts the matches at odd indexes
  return text.split(new RegExp(`(${words.join('|')})`, 'gi'))
    .map((part, index) => ({ text: part, match: index % 2 === 1 }))
    .filter(part => part.text)
}

useSeoMeta({
  title: () => query.value ? `Search: ${query.value}` : 'Search',
  robots: 'noindex, follow',
})
</script>

<template>
  <div class="mx-auto max-w-page px-4 md:px-8">
    <header class="border-b border-mf-rule pt-8 pb-6 sm:pt-12 space-y-4 max-w-measure-wide">
      <h1 class="mf-h1">
        Search
      </h1>
      <SearchForm large />
    </header>

    <div class="py-8 max-w-measure-wide">
      <template v-if="query">
        <p
          class="font-sans text-sm text-mf-ink-muted mb-6"
          aria-live="polite"
        >
          {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }} for ‘{{ query }}’
        </p>

        <ol
          v-if="results.length"
          class="space-y-8"
        >
          <li
            v-for="result in results"
            :key="result.path"
            class="space-y-2"
          >
            <ul class="mf-pills">
              <li class="mf-pill mf-pill--format">
                {{ formatLabels[result.format] }}
              </li>
            </ul>
            <h2 class="font-serif font-semibold text-[21px]/7">
              <NuxtLink
                :to="result.path"
                class="mf-link"
              >
                {{ result.title }}
              </NuxtLink>
            </h2>
            <p
              v-for="snippet in result.snippets"
              :key="snippet.id"
              class="font-serif text-base/[26px] text-mf-ink"
            >
              <NuxtLink
                v-if="snippet.heading"
                :to="snippet.id"
                class="mf-link font-sans font-bold text-sm me-1"
              >{{ snippet.heading }}:</NuxtLink>
              <template
                v-for="(part, index) in highlight(snippet.text)"
                :key="index"
              >
                <mark
                  v-if="part.match"
                  class="mf-mark"
                >{{ part.text }}</mark>
                <template v-else>
                  {{ part.text }}
                </template>
              </template>
            </p>
          </li>
        </ol>

        <p
          v-else
          class="font-serif text-lg/[29px] text-mf-ink"
        >
          Nothing yet. <NuxtLink
            to="/contribute"
            class="mf-link"
          >Want to write that one?</NuxtLink>
        </p>
      </template>

      <p
        v-else
        class="font-serif text-lg/[29px] text-mf-ink"
      >
        Search every guide, template and article. Try ‘raid’, ‘ban appeal’ or ‘rules’.
      </p>
    </div>
  </div>
</template>
