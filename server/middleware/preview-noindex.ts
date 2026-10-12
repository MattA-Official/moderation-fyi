// Keep branch Previews (<branch>.preview.moderation.fyi) out of search engines.
// Marking the site non-indexable makes @nuxtjs/robots send `X-Robots-Tag: noindex`,
// add a robots meta tag and disallow everything in robots.txt for these hosts.
export default defineEventHandler((event) => {
  if (getRequestHost(event, { xForwardedHost: false }).endsWith('.preview.moderation.fyi')) {
    updateSiteConfig(event, { _context: 'preview', indexable: false })
  }
})
