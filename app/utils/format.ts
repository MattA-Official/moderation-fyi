export function formatDate(date: string | Date | undefined, month: 'short' | 'long' = 'short') {
  if (!date) return ''
  return new Date(date).toLocaleDateString('en-GB', { year: 'numeric', month, day: 'numeric' })
}

/** Turns a slug such as `best-practices` into `Best practices` */
export function humanise(value: string) {
  const text = value.replace(/[-_]+/g, ' ')
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const difficultyColours = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
} as const

export const licences = {
  'cc-by-nc-sa': { label: 'CC BY-NC-SA 4.0', to: 'https://creativecommons.org/licenses/by-nc-sa/4.0/' },
  'cc0': { label: 'CC0 1.0', to: 'https://creativecommons.org/publicdomain/zero/1.0/' },
  'cc-by': { label: 'CC BY 4.0', to: 'https://creativecommons.org/licenses/by/4.0/' },
  'cc-by-sa': { label: 'CC BY-SA 4.0', to: 'https://creativecommons.org/licenses/by-sa/4.0/' },
} as const

export const platformIcons: Record<string, string> = {
  discord: 'i-simple-icons-discord',
  reddit: 'i-simple-icons-reddit',
  twitch: 'i-simple-icons-twitch',
  youtube: 'i-simple-icons-youtube',
  kick: 'i-simple-icons-kick',
  slack: 'i-simple-icons-slack',
  discourse: 'i-simple-icons-discourse',
  telegram: 'i-simple-icons-telegram',
  matrix: 'i-simple-icons-matrix',
  mastodon: 'i-simple-icons-mastodon',
  bluesky: 'i-simple-icons-bluesky',
  facebook: 'i-simple-icons-facebook',
}
