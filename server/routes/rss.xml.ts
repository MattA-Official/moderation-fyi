import { queryCollection } from '@nuxt/content/server'

function escape(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

export default defineEventHandler(async (event) => {
  const site = getSiteConfig(event)
  const articles = await queryCollection(event, 'articles')
    .select('title', 'description', 'path', 'date')
    .order('date', 'DESC')
    .all()

  const items = articles.map((article) => {
    const url = new URL(article.path, site.url).href
    return `    <item>
      <title>${escape(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escape(article.description ?? '')}</description>
      <pubDate>${new Date(article.date).toUTCString()}</pubDate>
    </item>`
  }).join('\n')

  setHeader(event, 'content-type', 'application/rss+xml; charset=utf-8')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(site.name)}</title>
    <link>${site.url}</link>
    <description>${escape(site.description)}</description>
    <language>en-gb</language>
    <atom:link href="${new URL('/rss.xml', site.url).href}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>
`
})
