const placeholders = [
  'Try ‘server rules’',
  'Try ‘welcome message’',
  'Try ‘ban appeal’',
  'Try ‘slowmode’',
  'Try ‘building a mod team’',
  'Try ‘removal reasons’',
  'What are you working on?',
  'Search guides, templates and articles',
  'Looking for a template?',
  'What can we help with today?',
]

/**
 * A different placeholder on each page load. The pick is made once during
 * server rendering and sent to the browser in the payload with useState, so
 * hydration always matches.
 */
export function useSearchPlaceholder() {
  return useState('search-placeholder', () => placeholders[Math.floor(Math.random() * placeholders.length)]!)
}
