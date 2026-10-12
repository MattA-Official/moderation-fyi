/**
 * Loads the authors collection once and resolves author IDs (file names in
 * `content/authors`) into author objects that `UUser`/`UBlogPost` understand.
 */
export async function useAuthors() {
  const { data: authors } = await useAsyncData('authors', () => queryCollection('authors').all())

  const authorMap = computed(() => Object.fromEntries(
    (authors.value ?? []).map(author => [author.stem.replace(/^authors\//, ''), author]),
  ))

  function resolveAuthors(ids: string[] | undefined) {
    return (ids ?? []).flatMap((id) => {
      const author = authorMap.value[id]
      if (!author) return []
      return [{
        name: author.name,
        description: author.description,
        avatar: { src: author.avatar.src, alt: author.avatar.alt || author.name },
        to: author.to,
        target: author.target ?? (author.to?.startsWith('http') ? '_blank' : undefined),
      }]
    })
  }

  return { authors, resolveAuthors }
}
