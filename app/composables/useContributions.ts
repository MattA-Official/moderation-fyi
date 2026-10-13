export type Contribution = {
  title: string
  description?: string
  path: string
  format: ContentFormat
  date: string
  authors: string[]
}

/**
 * Every guide, template and article with its authors, newest first. Used for
 * the bio pages ("Written by …") and the counts in the author directory.
 */
export async function useContributions() {
  const { data } = await useAsyncData('contributions', async () => {
    const [guides, templates, articles] = await Promise.all([
      queryCollection('guides').select('title', 'description', 'path', 'publishedAt', 'authors').all(),
      queryCollection('templates').select('title', 'description', 'path', 'publishedAt', 'authors').all(),
      queryCollection('articles').select('title', 'description', 'path', 'date', 'authors').all(),
    ])
    const all: Contribution[] = [
      ...guides.map(({ publishedAt, ...item }) => ({ ...item, format: 'guide' as const, date: String(publishedAt) })),
      ...templates.map(({ publishedAt, ...item }) => ({ ...item, format: 'template' as const, date: String(publishedAt) })),
      ...articles.map(({ date, ...item }) => ({ ...item, format: 'article' as const, date: String(date) })),
    ]
    return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  })

  function byAuthor(id: string) {
    return (data.value ?? []).filter(item => item.authors?.includes(id))
  }

  return { contributions: data, byAuthor }
}
