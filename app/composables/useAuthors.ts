/**
 * Loads the authors collection once and resolves author IDs (file names in
 * `content/authors`) into the shape bylines and the directory use. Authors
 * with a `link` point there; everyone else gets their bio page.
 */
export async function useAuthors() {
  const { data: authors } = await useAsyncData('authors', () => queryCollection('authors')
    .select('stem', 'path', 'name', 'description', 'avatar', 'link', 'pronouns')
    .order('name', 'ASC')
    .all())

  const list = computed(() => (authors.value ?? []).map(author => ({
    id: authorId(author.stem),
    name: author.name,
    description: author.description,
    pronouns: author.pronouns,
    avatar: { src: author.avatar?.src, alt: author.avatar?.alt || author.name },
    to: author.link ?? author.path,
    external: Boolean(author.link),
  })))

  const authorMap = computed(() => Object.fromEntries(list.value.map(author => [author.id, author])))

  function resolveAuthors(ids: string[] | undefined) {
    return (ids ?? []).flatMap(id => authorMap.value[id] ?? [])
  }

  return { authors: list, resolveAuthors }
}

/** `authors/sam-okafor` → `sam-okafor`, the ID content files list in `authors` */
export function authorId(stem: string) {
  return stem.replace(/^authors\//, '')
}
