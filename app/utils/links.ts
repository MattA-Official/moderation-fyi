/** Hosts that count as this site: moderation.fyi and its preview subdomains */
export function isOwnHost(hostname: string, siteHost: string) {
  return hostname === siteHost || hostname.endsWith(`.${siteHost}`)
}

/**
 * Whether `url` is one of the trusted links or beneath one. Matching stops at
 * path boundaries, so `github.com/moderation-fyi` doesn't also trust
 * `github.com/moderation-fyi-fake`. GitHub paths are case-insensitive.
 */
export function isTrustedLink(url: URL, trusted: readonly string[]) {
  const target = `${url.origin}${url.pathname}`.toLowerCase().replace(/\/$/, '')
  return trusted.some((entry) => {
    const prefix = entry.toLowerCase().replace(/\/$/, '')
    return target === prefix || target.startsWith(`${prefix}/`)
  })
}
