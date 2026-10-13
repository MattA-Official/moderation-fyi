// Fixed vocabularies shared by the content schema and the site. Topics are
// not here: they live in content/topics/ so they can change without code.

/** Platforms a page applies to, with names as the platforms write them */
export const platforms = {
  discord: 'Discord',
  reddit: 'Reddit',
  twitch: 'Twitch',
  matrix: 'Matrix',
  youtube: 'YouTube',
  bluesky: 'Bluesky',
  forums: 'Forums',
} as const

export type Platform = keyof typeof platforms

export const platformIds = Object.keys(platforms) as [Platform, ...Platform[]]

/** Laws and regulations a template helps with */
export const compliance = {
  'gdpr': 'GDPR',
  'coppa': 'COPPA',
  'dsa': 'DSA',
  'online-safety-act': 'Online Safety Act',
} as const

export type Compliance = keyof typeof compliance

export const complianceIds = Object.keys(compliance) as [Compliance, ...Compliance[]]
