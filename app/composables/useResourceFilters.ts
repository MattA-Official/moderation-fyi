import type { LocationQuery } from 'vue-router'

type Item = {
  title: string
  description?: string
  [key: string]: unknown
}

export type SortOption = { value: string, label: string }

export type FilterOptions = {
  /** Facet headings, overriding the defaults below, e.g. `{ category: 'Section' }` */
  labels?: Record<string, string>
  /** Facets shown as a dropdown under "Advanced" instead of as pills */
  advanced?: string[]
  /** A label for a facet value, such as a topic or author name; falls back to the defaults */
  optionLabel?: (facet: string, value: string) => string | undefined
  /** The item field holding its date; turns on the date range and date sorts */
  dateField?: string
  /** Set to false when the page owns the `q` search itself */
  search?: boolean
  /** Sort choices; the first is the default and is left out of the URL */
  sorts?: SortOption[]
}

const facetLabels: Record<string, string> = {
  authors: 'Author',
  difficulty: 'Experience',
  platforms: 'Platform',
  templateType: 'Type',
  topics: 'Topic',
}

function defaultOptionLabel(facet: string, value: string) {
  if (facet === 'difficulty') return difficultyLabels[value as keyof typeof difficultyLabels] ?? humanise(value)
  if (facet === 'platforms') return platformLabel(value)
  return humanise(value)
}

/**
 * Client-side search, facet filtering, date range and sorting for resource
 * listings. Several values in one facet match any of them; facets combine.
 * State is mirrored to the URL query (`?platforms=discord,reddit&from=…`) so
 * filtered views can be shared.
 */
export function useResourceFilters<T extends Item>(items: Ref<T[] | null | undefined>, facets: string[], options: FilterOptions = {}) {
  const route = useRoute()
  const router = useRouter()

  const withSearch = options.search ?? true
  const dateField = options.dateField
  const sorts = options.sorts ?? []
  const defaultSort = sorts[0]?.value ?? ''
  const keys = [
    ...(withSearch ? ['q'] : []),
    ...facets,
    ...(dateField ? ['from', 'to'] : []),
    ...(sorts.length > 1 ? ['sort'] : []),
  ]

  const labelOf = (facet: string, value: string) => options.optionLabel?.(facet, value) ?? defaultOptionLabel(facet, value)

  const fromQuery = (query: LocationQuery) => ({
    search: withSearch && typeof query.q === 'string' ? query.q : '',
    filters: Object.fromEntries(facets.map(facet => [facet, parseList(query[facet])])) as Record<string, string[]>,
    from: dateField && isDay(query.from) ? query.from : '',
    to: dateField && isDay(query.to) ? query.to : '',
    sort: sorts.some(option => option.value === query.sort) ? query.sort as string : defaultSort,
  })

  /** This listing's part of the URL query; other keys are left alone */
  const toQuery = () => {
    const query: Record<string, string | undefined> = {}
    if (withSearch) query.q = search.value || undefined
    for (const facet of facets) query[facet] = filters.value[facet]?.join(',') || undefined
    if (dateField) {
      query.from = from.value || undefined
      query.to = to.value || undefined
    }
    if (sorts.length > 1) query.sort = sort.value === defaultSort ? undefined : sort.value
    return query
  }
  const sameQuery = (a: LocationQuery | Record<string, string | undefined>, b: LocationQuery | Record<string, string | undefined>) =>
    keys.every(key => (a[key] || undefined) === (b[key] || undefined))

  const initial = fromQuery(route.query)
  const search = ref(initial.search)
  const filters = ref<Record<string, string[]>>(initial.filters)
  const from = ref(initial.from)
  const to = ref(initial.to)
  const sort = ref(initial.sort)

  const words = computed(() => search.value.trim().toLowerCase().split(/\s+/).filter(Boolean))

  // Facet values and their labels are searchable, so "discord" or an
  // author's name finds what's tagged with it
  function matches(item: T, except?: string) {
    if (words.value.length) {
      const haystack = [item.title, item.description, ...facets.flatMap(facet => valuesOf(item, facet).flatMap(value => [value, labelOf(facet, value)]))]
        .join(' ')
        .toLowerCase()
      if (!words.value.every(word => haystack.includes(word))) return false
    }
    if (dateField && !inRange(isoDay(item[dateField]), from.value, to.value)) return false
    return matchesFacets(item, filters.value, except)
  }

  const results = computed(() => sortItems((items.value ?? []).filter(item => matches(item)), sort.value, dateField))

  // Options come from the values present in the content. Each count is what
  // picking that value would show given the other filters; a selected value
  // stays listed even when nothing has it, so it can be cleared. A facet with
  // a single value is still shown, so a short listing doesn't look broken
  const facetOptions = computed(() => facets.map((facet) => {
    const pool = (items.value ?? []).filter(item => matches(item, facet))
    const values = new Set([...(items.value ?? []).flatMap(item => valuesOf(item, facet)), ...(filters.value[facet] ?? [])])
    return {
      key: facet,
      label: options.labels?.[facet] ?? facetLabels[facet] ?? humanise(facet),
      advanced: options.advanced?.includes(facet) ?? false,
      items: [...values]
        .map(value => ({ value, label: labelOf(facet, value), count: pool.filter(item => valuesOf(item, facet).includes(value)).length }))
        .sort((a, b) => a.label.localeCompare(b.label, 'en-GB')),
    }
  }).filter(option => option.items.length > 0))

  const filterCount = computed(() => Object.values(filters.value).reduce((total, selected) => total + (selected?.length ?? 0), 0)
    + (from.value ? 1 : 0) + (to.value ? 1 : 0))
  const active = computed(() => Boolean(search.value) || filterCount.value > 0)

  watch([search, filters, from, to, sort], () => {
    const query = toQuery()
    if (sameQuery(query, route.query)) return
    const next = Object.fromEntries(Object.entries({ ...route.query, ...query }).filter(([, value]) => value !== undefined && value !== ''))
    router.replace({ query: next as LocationQuery })
  }, { deep: true })

  // Back/forward, or a link to this same listing, changes the query without
  // remounting the page, so the filters have to follow the URL
  watch(() => route.query, (query) => {
    if (sameQuery(query, toQuery())) return
    const next = fromQuery(query)
    search.value = next.search
    filters.value = next.filters
    from.value = next.from
    to.value = next.to
    sort.value = next.sort
  })

  /** Clears the search and every filter; the sort order stays */
  function reset() {
    search.value = ''
    filters.value = Object.fromEntries(facets.map(facet => [facet, []]))
    from.value = ''
    to.value = ''
  }

  return { search, filters, from, to, sort, sorts, dated: Boolean(dateField), options: facetOptions, filterCount, active, results, reset }
}
