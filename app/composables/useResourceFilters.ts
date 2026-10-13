import type { LocationQuery } from 'vue-router'

type Item = {
  title: string
  description?: string
  tags?: string[]
  [key: string]: unknown
}

const facetLabels: Record<string, string> = {
  category: 'Topic',
  difficulty: 'Experience',
  platforms: 'Platform',
  templateType: 'Type',
}

function optionLabel(facet: string, value: string) {
  if (facet === 'difficulty') return difficultyLabels[value as keyof typeof difficultyLabels] ?? humanise(value)
  if (facet === 'platforms') return platformLabel(value)
  return humanise(value)
}

/**
 * Client-side search and facet filtering for resource listings. Filter state
 * is mirrored to the URL query so filtered views can be shared.
 */
export function useResourceFilters<T extends Item>(items: Ref<T[] | null | undefined>, facets: string[]) {
  const route = useRoute()
  const router = useRouter()

  const fromQuery = (query: LocationQuery) => ({
    search: typeof query.q === 'string' ? query.q : '',
    filters: Object.fromEntries(facets.map(facet => [facet, typeof query[facet] === 'string' ? query[facet] as string : undefined])),
  })
  const toQuery = () => Object.fromEntries(Object.entries({ q: search.value || undefined, ...filters.value }).filter(([, value]) => value)) as Record<string, string>
  const sameQuery = (a: LocationQuery, b: LocationQuery) => ['q', ...facets].every(key => (a[key] || undefined) === (b[key] || undefined))

  const initial = fromQuery(route.query)
  const search = ref(initial.search)
  const filters = ref<Record<string, string | null | undefined>>(initial.filters)

  // Facet options are built from the values actually present in the content
  const options = computed(() => facets.map((facet) => {
    const values = new Set<string>()
    for (const item of items.value ?? []) {
      const value = item[facet]
      for (const entry of Array.isArray(value) ? value : [value]) {
        if (typeof entry === 'string' && entry) values.add(entry)
      }
    }
    return {
      key: facet,
      label: facetLabels[facet] ?? humanise(facet),
      items: [...values].sort().map(value => ({ label: optionLabel(facet, value), value })),
    }
  }).filter(option => option.items.length > 1))

  const active = computed(() => Boolean(search.value || Object.values(filters.value).some(Boolean)))

  const results = computed(() => {
    const query = search.value.trim().toLowerCase()
    return (items.value ?? []).filter((item) => {
      if (query) {
        const haystack = [item.title, item.description, ...(item.tags ?? [])].join(' ').toLowerCase()
        if (!query.split(/\s+/).every(word => haystack.includes(word))) return false
      }
      return Object.entries(filters.value).every(([facet, selected]) => {
        if (!selected) return true
        const value = item[facet]
        return Array.isArray(value) ? value.includes(selected) : value === selected
      })
    })
  })

  watch([search, filters], () => {
    const query = toQuery()
    if (!sameQuery(query, route.query)) router.replace({ query })
  }, { deep: true })

  // Back/forward, or a link to this same listing, changes the query without
  // remounting the page, so the filters have to follow the URL
  watch(() => route.query, (query) => {
    if (sameQuery(query, toQuery())) return
    const next = fromQuery(query)
    search.value = next.search
    filters.value = next.filters
  })

  function reset() {
    search.value = ''
    filters.value = Object.fromEntries(facets.map(facet => [facet, undefined]))
  }

  return { search, filters, options, active, results, reset }
}
