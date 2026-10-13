/** "2 May 2026" in body copy */
export function formatDate(date: string | Date | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })
}

/** "May 2026" on review stamps */
export function formatMonth(date: string | Date | undefined) {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month: 'long' })
}

/** `2026-05-02` in metadata */
export function isoDate(date: string | Date | undefined) {
  return date ? new Date(date).toISOString().slice(0, 10) : undefined
}

/** Turns a slug such as `best-practices` into `Best practices` (sentence case) */
export function humanise(value: string) {
  const text = value.replace(/[-_]+/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export type ContentFormat = 'guide' | 'template' | 'article'

/** Format pill text. The word does the work; formats are never colour-coded. */
export const formatLabels: Record<ContentFormat, string> = {
  guide: 'Guide',
  template: 'Template',
  article: 'Article',
}

/** Difficulty in the design system's words */
export const difficultyLabels = {
  beginner: 'New mod',
  intermediate: 'Experienced',
  advanced: 'Specialist',
} as const

/** Platform names as the platforms write them */
const platformNames: Record<string, string> = {
  youtube: 'YouTube',
  bluesky: 'Bluesky',
}

export function platformLabel(platform: string) {
  return platformNames[platform] ?? humanise(platform)
}

export const licences = {
  'cc-by-nc-sa': { label: 'CC BY-NC-SA 4.0', to: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' },
  'cc0': { label: 'CC0 1.0', to: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  'cc-by': { label: 'CC BY 4.0', to: 'https://creativecommons.org/licenses/by/4.0/' },
  'cc-by-sa': { label: 'CC BY-SA 4.0', to: 'https://creativecommons.org/licenses/by-sa/4.0/' },
} as const

type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

function countWords(nodes: MinimarkNode[] | undefined): number {
  let words = 0
  for (const node of nodes ?? []) {
    if (typeof node === 'string') {
      words += node.split(/\s+/).filter(Boolean).length
    }
    else if (Array.isArray(node)) {
      const [, , ...children] = node
      words += countWords(children)
    }
  }
  return words
}

/** "Roughly N minutes" at about 220 words a minute */
export function readingTime(body: { value?: unknown } | undefined) {
  const words = countWords(body?.value as MinimarkNode[] | undefined)
  const minutes = Math.max(1, Math.round(words / 220))
  return minutes === 1 ? 'Roughly 1 minute' : `Roughly ${minutes} minutes`
}

/** Content not reviewed in over 12 months gets the stale banner */
export function isStale(lastReviewed: string | Date | undefined) {
  if (!lastReviewed) return false
  const reviewed = new Date(lastReviewed)
  const yearAgo = new Date()
  yearAgo.setFullYear(yearAgo.getFullYear() - 1)
  return reviewed < yearAgo
}
