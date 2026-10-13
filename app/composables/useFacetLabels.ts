/**
 * Labels for facet values that live in content rather than code: topic names
 * from `content/topics` and author names from `content/authors`. Pass the
 * result to useResourceFilters as `optionLabel`.
 */
export async function useFacetLabels() {
  // Both start before either is awaited: after an await, Nuxt composables
  // lose track of the component that called them
  const [{ data: topics }, { authors }] = await Promise.all([
    useAsyncData('topics', () => queryCollection('topics').select('stem', 'label').all()),
    useAuthors(),
  ])

  const topicNames = computed(() => Object.fromEntries((topics.value ?? []).map(topic => [topicId(topic.stem), topic.label])))
  const authorNames = computed(() => Object.fromEntries(authors.value.map(author => [author.id, author.name])))

  return (facet: string, value: string): string | undefined => {
    if (facet === 'topics') return topicNames.value[value]
    if (facet === 'authors') return authorNames.value[value]
    return undefined
  }
}

/** `topics/raids` → `raids`, the ID content files list in `topics` */
export function topicId(stem: string) {
  return stem.replace(/^topics\//, '')
}
