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

// What the filters need to know about each page
const { data: pages } = await useAsyncData('search-pages', async () => {
  const fields = ['path', 'title', 'description', 'topics', 'platforms', 'authors'] as const
  const [guides, templates, articles] = await Promise.all([
    queryCollection('guides').select(...fields, 'publishedAt').all(),
    queryCollection('templates').select(...fields, 'publishedAt').all(),
    queryCollection('articles').select(...fields, 'date').all(),
  ])
  return [
    ...guides.map(({ publishedAt, ...page }) => ({ ...page, format: 'guide' as const, date: isoDay(publishedAt) })),
    ...templates.map(({ publishedAt, ...page }) => ({ ...page, format: 'template' as const, date: isoDay(publishedAt) })),
    ...articles.map(({ date, ...page }) => ({ ...page, format: 'article' as const, date: isoDay(date) })),
  ]
})

function pageOf(id: string) {
  return id.split('#')[0]!
}

type Snippet = { id: string, heading: string, text: string }

// Group matching sections by page; pages whose title matches come first.
// With no search words, every page is a candidate, so the filters alone can
// be used to browse, newest first
const matches = computed(() => {
  const words = query.value.toLowerCase().split(/\s+/).filter(Boolean)
  if (!words.length) {
    return sortItems((pages.value ?? []).map(page => ({ ...page, score: 0, snippets: [] as Snippet[] })), 'newest', 'date')
  }

  const byPath = new Map((pages.value ?? []).map(page => [page.path, page]))
  const found = new Map<string, { score: number, snippets: Snippet[] }>()
  for (const section of sections.value ?? []) {
    const haystack = [section.title, ...section.titles, section.content].join(' ').toLowerCase()
    if (!words.every(word => haystack.includes(word))) continue

    const path = pageOf(section.id)
    const match = found.get(path) ?? { score: 0, snippets: [] }
    if (section.id === path) match.score += 10
    match.score += 1
    if (match.snippets.length < 2 && section.content) {
      match.snippets.push({ id: section.id, heading: section.id === path ? '' : section.title, text: excerpt(section.content, words) })
    }
    found.set(path, match)
  }
  return [...found.entries()]
    .flatMap(([path, match]) => byPath.has(path) ? [{ ...byPath.get(path)!, ...match }] : [])
    .sort((a, b) => b.score - a.score)
})

const optionLabel = await useFacetLabels()
const { filters, from, to, sort, sorts, results, options, filterCount, reset, active } = useResourceFilters(matches, ['format', 'topics', 'platforms', 'authors'], {
  search: false,
  labels: { format: 'Format' },
  advanced: ['authors'],
  optionLabel: (facet, value) => facet === 'format' ? formatLabels[value as ContentFormat] : optionLabel(facet, value),
  dateField: 'date',
  sorts: [
    { value: 'relevance', label: 'Best match' },
    { value: 'newest', label: 'Newest first' },
    { value: 'oldest', label: 'Oldest first' },
  ],
})

function excerpt(text: string, words: string[]) {
  const lower = text.toLowerCase()
  // A section can match on its page's title alone; then start at the top
  const found = words.map(word => lower.indexOf(word)).filter(index => index >= 0)
  const at = found.length ? Math.max(0, Math.min(...found) - 60) : 0
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
      <ResourceFilters
        v-model:filters="filters"
        v-model:from="from"
        v-model:to="to"
        v-model:sort="sort"
        class="mb-8"
        :options="options"
        :sorts="sorts"
        :active="active"
        :filter-count="filterCount"
        :count="results.length"
        :show-search="false"
        :show-count="false"
        date-label="Published"
        noun="result"
        @reset="reset"
      />

      <template v-if="query || active">
        <p
          class="font-sans text-sm text-mf-ink-muted mb-6"
          aria-live="polite"
        >
          {{ results.length }} {{ results.length === 1 ? 'result' : 'results' }}<template v-if="query">
            for ‘{{ query }}’
          </template>
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
                <UIcon
                  :name="formatIcons[result.format]"
                  class="size-3.5"
                  aria-hidden="true"
                />
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
              v-if="!result.snippets.length && result.description"
              class="font-serif text-base/[26px] text-mf-ink"
            >
              {{ result.description }}
            </p>
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
          v-else-if="filterCount"
          class="font-serif text-lg/[29px] text-mf-ink"
        >
          Nothing matches those filters.
          <button
            type="button"
            class="mf-link font-sans font-bold text-base"
            @click="reset"
          >
            Clear filters
          </button>
        </p>
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
        Search every guide, template and article. Try ‘rules’, ‘welcome message’ or ‘ban appeal’, or use Filters to browse by topic, platform, author or date.
      </p>
    </div>
  </div>
</template>
