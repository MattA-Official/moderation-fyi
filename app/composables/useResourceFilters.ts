type Item = {
  title: string
  description?: string
  tags?: string[]
  [key: string]: unknown
}

/**
 * Client-side search and facet filtering for resource listings. Filter state
 * is mirrored to the URL query so filtered views can be shared.
 */
export function useResourceFilters<T extends Item>(items: Ref<T[] | null | undefined>, facets: string[]) {
  const route = useRoute()
  const router = useRouter()

  const search = ref(typeof route.query.q === 'string' ? route.query.q : '')
  const filters = ref<Record<string, string | null | undefined>>(Object.fromEntries(
    facets.map(facet => [facet, typeof route.query[facet] === 'string' ? route.query[facet] as string : undefined]),
  ))

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
      label: facet === 'templateType' ? 'Type' : humanise(facet.replace(/s$/, '')),
      items: [...values].sort().map(value => ({ label: humanise(value), value })),
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
    const query = Object.fromEntries(Object.entries({ q: search.value || undefined, ...filters.value }).filter(([, value]) => value))
    router.replace({ query })
  }, { deep: true })

  function reset() {
    search.value = ''
    filters.value = Object.fromEntries(facets.map(facet => [facet, undefined]))
  }

  return { search, filters, options, active, results, reset }
}
