import { computed, createApp, effectScope, nextTick, ref, watch } from 'vue'
import { createMemoryHistory, createRouter, useRoute, useRouter } from 'vue-router'
import { beforeAll, describe, expect, it, vi } from 'vitest'
import * as format from '../app/utils/format'

// Stand in for the Nuxt auto-imports the composable relies on
beforeAll(() => {
  for (const [name, value] of Object.entries({ computed, ref, watch, useRoute, useRouter, ...format })) {
    vi.stubGlobal(name, value)
  }
})

const guides = [
  { title: 'Discord onboarding', category: 'onboarding', platforms: ['discord'] },
  { title: 'Reddit automod', category: 'automation', platforms: ['reddit'] },
  { title: 'Discord automod', category: 'automation', platforms: ['discord'] },
]

async function setup(path: string) {
  const { useResourceFilters } = await import('../app/composables/useResourceFilters')
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/guides', component: {} }, { path: '/', component: {} }],
  })
  const app = createApp({})
  app.use(router)
  await router.push(path)
  const filters = effectScope().run(() => app.runWithContext(() => useResourceFilters(ref(guides), ['platforms', 'category'])))!
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
    expect(filters.value.platforms).toBe('discord')
    expect(results.value.map(guide => guide.title)).toEqual(['Discord automod'])
  })

  it('mirrors filter changes to the URL', async () => {
    const { router, filters } = await setup('/guides')
    filters.value.category = 'automation'
    await settle()
    expect(router.currentRoute.value.query).toEqual({ category: 'automation' })
  })

  it('follows the URL on back and forward', async () => {
    const { router, filters, results } = await setup('/guides?category=automation')
    await router.push('/guides?category=onboarding')
    await settle()
    expect(filters.value.category).toBe('onboarding')

    router.back()
    await settle()
    expect(router.currentRoute.value.query).toEqual({ category: 'automation' })
    expect(filters.value.category).toBe('automation')
    expect(results.value).toHaveLength(2)

    router.forward()
    await settle()
    expect(filters.value.category).toBe('onboarding')
    expect(results.value.map(guide => guide.title)).toEqual(['Discord onboarding'])
  })

  it('clears the filters when the listing is opened again without a query', async () => {
    const { router, search, filters, active } = await setup('/guides?q=discord&platforms=discord')
    await router.push('/guides')
    await settle()
    expect(search.value).toBe('')
    expect(filters.value.platforms).toBeUndefined()
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
})
