import { computed, createApp, effectScope, nextTick, ref, watch } from 'vue'
import { createMemoryHistory, createRouter, useRoute, useRouter } from 'vue-router'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import * as filterUtils from '../app/utils/filters'
import * as format from '../app/utils/format'
import type { FilterOptions } from '../app/composables/useResourceFilters'

// Stand in for the Nuxt auto-imports the composable relies on
beforeAll(() => {
  for (const [name, value] of Object.entries({ computed, ref, watch, useRoute, useRouter, ...format, ...filterUtils })) {
    vi.stubGlobal(name, value)
  }
})

const guides = [
  { title: 'Discord onboarding', category: 'onboarding', platforms: ['discord'], authors: ['sam'], publishedAt: '2026-01-10' },
  { title: 'Reddit automod', category: 'automation', platforms: ['reddit'], authors: ['rhiannon'], publishedAt: '2026-03-05' },
  { title: 'Discord automod', category: 'automation', platforms: ['discord'], authors: ['sam'], publishedAt: '2026-06-20' },
]

async function setup(path: string, facets = ['platforms', 'category'], options: FilterOptions = {}) {
  const { useResourceFilters } = await import('../app/composables/useResourceFilters')
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/guides', component: {} }, { path: '/', component: {} }],
  })
  const app = createApp({})
  app.use(router)
  await router.push(path)
  const filters = effectScope().run(() => app.runWithContext(() => useResourceFilters(ref(guides), facets, options)))!
  return { router, ...filters }
}

// Lets the watchers and any navigation they start settle
async function settle() {
  await new Promise(resolve => setTimeout(resolve))
  await nextTick()
}

describe('useResourceFilters', () => {
  it('reads the initial filters from the URL', async () => {
    const { search, filters, results } = await setup('/guides?q=automod&platforms=discord')
    expect(search.value).toBe('automod')
    expect(filters.value.platforms).toEqual(['discord'])
    expect(results.value.map(guide => guide.title)).toEqual(['Discord automod'])
  })

  it('mirrors filter changes to the URL', async () => {
    const { router, filters } = await setup('/guides')
    filters.value.category = ['automation']
    await settle()
    expect(router.currentRoute.value.query).toEqual({ category: 'automation' })
  })

  it('follows the URL on back and forward', async () => {
    const { router, filters, results } = await setup('/guides?category=automation')
    await router.push('/guides?category=onboarding')
    await settle()
    expect(filters.value.category).toEqual(['onboarding'])

    router.back()
    await settle()
    expect(router.currentRoute.value.query).toEqual({ category: 'automation' })
    expect(filters.value.category).toEqual(['automation'])
    expect(results.value).toHaveLength(2)

    router.forward()
    await settle()
    expect(filters.value.category).toEqual(['onboarding'])
    expect(results.value.map(guide => guide.title)).toEqual(['Discord onboarding'])
  })

  it('clears the filters when the listing is opened again without a query', async () => {
    const { router, search, filters, active } = await setup('/guides?q=discord&platforms=discord')
    await router.push('/guides')
    await settle()
    expect(search.value).toBe('')
    expect(filters.value.platforms).toEqual([])
    expect(active.value).toBe(false)
  })
  it('keeps input typed while the URL is still catching up', async () => {
    const { router, search } = await setup('/guides')
    search.value = 'a'
    await nextTick()
    search.value = 'au'
    await nextTick()
    search.value = 'aut'
    await settle()
    expect(search.value).toBe('aut')
    expect(router.currentRoute.value.query).toEqual({ q: 'aut' })
  })

  it('matches any of several values in one facet, read from a comma-separated URL', async () => {
    const { filters, results } = await setup('/guides?category=onboarding,automation&platforms=discord')
    expect(filters.value.category).toEqual(['onboarding', 'automation'])
    expect(results.value.map(guide => guide.title)).toEqual(['Discord onboarding', 'Discord automod'])
  })

  it('writes several values back as one comma-separated key', async () => {
    const { router, filters } = await setup('/guides')
    filters.value.platforms = ['discord', 'reddit']
    await settle()
    expect(router.currentRoute.value.query).toEqual({ platforms: 'discord,reddit' })
  })

  it('counts each option against the other filters', async () => {
    const { options } = await setup('/guides?category=automation')
    const platforms = options.value.find(option => option.key === 'platforms')!
    expect(platforms.items.map(item => [item.value, item.count])).toEqual([['discord', 1], ['reddit', 1]])
    const category = options.value.find(option => option.key === 'category')!
    expect(category.items.map(item => [item.value, item.count])).toEqual([['automation', 2], ['onboarding', 1]])
  })

  it('keeps a selected value listed when nothing has it, so it can be cleared', async () => {
    const { options, results } = await setup('/guides?platforms=twitch')
    expect(results.value).toHaveLength(0)
    const platforms = options.value.find(option => option.key === 'platforms')!
    expect(platforms.items.find(item => item.value === 'twitch')?.count).toBe(0)
  })

  it('filters by an inclusive date range and ignores malformed dates', async () => {
    const dated = { dateField: 'publishedAt' }
    const { results } = await setup('/guides?from=2026-03-05&to=2026-06-20', undefined, dated)
    expect(results.value.map(guide => guide.title)).toEqual(['Reddit automod', 'Discord automod'])
    const { from, results: all } = await setup('/guides?from=last-week', undefined, dated)
    expect(from.value).toBe('')
    expect(all.value).toHaveLength(3)
  })

  it('sorts, leaving the default sort out of the URL', async () => {
    const sorts = [{ value: 'newest', label: 'Newest' }, { value: 'oldest', label: 'Oldest' }, { value: 'title', label: 'Title' }]
    const { router, sort, results } = await setup('/guides?sort=title', undefined, { dateField: 'publishedAt', sorts })
    expect(results.value.map(guide => guide.title)).toEqual(['Discord automod', 'Discord onboarding', 'Reddit automod'])
    sort.value = 'newest'
    await settle()
    expect(router.currentRoute.value.query).toEqual({})
    expect(results.value.at(0)?.title).toBe('Discord automod')
  })

  it('searches facet labels, such as an author name', async () => {
    const optionLabel = (facet: string, value: string) => facet === 'authors' ? { sam: 'Sam Okafor', rhiannon: 'Rhiannon Price' }[value] : undefined
    const { results } = await setup('/guides?q=rhiannon', ['platforms', 'authors'], { optionLabel })
    expect(results.value.map(guide => guide.title)).toEqual(['Reddit automod'])
  })

  it('leaves the page\'s own query keys alone when search is off', async () => {
    const { router, search, filters } = await setup('/guides?q=automod', undefined, { search: false })
    expect(search.value).toBe('')
    filters.value.platforms = ['reddit']
    await settle()
    expect(router.currentRoute.value.query).toEqual({ q: 'automod', platforms: 'reddit' })
  })
})
