// Pure helpers behind useResourceFilters, kept free of Vue so they can be
// tested on their own.

type Fields = Record<string, unknown>

/** A field's values as a list, whether it holds one string or many */
export function valuesOf(item: Fields, key: string): string[] {
  const value = item[key]
  return (Array.isArray(value) ? value : [value]).filter((entry): entry is string => typeof entry === 'string' && entry !== '')
}

/** `discord,reddit` (or a repeated query key) as a de-duplicated list */
export function parseList(value: unknown): string[] {
  const parts = (Array.isArray(value) ? value : [value])
    .flatMap(entry => typeof entry === 'string' ? entry.split(',') : [])
    .map(entry => entry.trim())
    .filter(Boolean)
  return [...new Set(parts)]
}

/** True for a `YYYY-MM-DD` string, the format date inputs use */
export function isDay(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && !Number.isNaN(Date.parse(value))
}

/** A content date (a Date or an ISO string) as `YYYY-MM-DD` */
export function isoDay(value: unknown): string | undefined {
  if (value instanceof Date) return Number.isNaN(value.getTime()) ? undefined : value.toISOString().slice(0, 10)
  if (typeof value !== 'string' || !value) return undefined
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? undefined : date.toISOString().slice(0, 10)
}

/** Inclusive at both ends; an undated item only passes when no range is set */
export function inRange(day: string | undefined, from: string, to: string) {
  if (!from && !to) return true
  if (!day) return false
  return (!from || day >= from) && (!to || day <= to)
}

/**
 * Selected values are ORed within a facet and facets are ANDed together.
 * `except` leaves one facet out, which is how option counts are worked out.
 */
export function matchesFacets(item: Fields, selections: Record<string, string[]>, except?: string) {
  return Object.entries(selections).every(([facet, selected]) => {
    if (facet === except || !selected?.length) return true
    const values = valuesOf(item, facet)
    return selected.some(value => values.includes(value))
  })
}

/**
 * `newest`, `oldest` and `title` sort; any other value (such as `relevance`)
 * keeps the order the items came in.
 */
export function sortItems<T extends Fields>(items: T[], sort: string | undefined, dateField?: string) {
  const time = (item: T) => {
    const day = dateField ? isoDay(item[dateField]) : undefined
    return day ? Date.parse(day) : 0
  }
  if (sort === 'newest' && dateField) return [...items].sort((a, b) => time(b) - time(a))
  if (sort === 'oldest' && dateField) return [...items].sort((a, b) => time(a) - time(b))
  if (sort === 'title') return [...items].sort((a, b) => String(a.title ?? '').localeCompare(String(b.title ?? ''), 'en-GB'))
  return items
}

/** Sort choices for the guide, template and article listings */
export const listingSorts = [
  { value: 'newest', label: 'Newest first' },
  { value: 'oldest', label: 'Oldest first' },
  { value: 'title', label: 'Title, A to Z' },
]
