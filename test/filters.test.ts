import { describe, expect, it } from 'vitest'
import { inRange, isDay, isoDay, matchesFacets, parseList, sortItems, valuesOf } from '../app/utils/filters'

describe('filter helpers', () => {
  it('reads a field as a list', () => {
    expect(valuesOf({ platforms: ['discord', ''] }, 'platforms')).toEqual(['discord'])
    expect(valuesOf({ category: 'tools' }, 'category')).toEqual(['tools'])
    expect(valuesOf({}, 'category')).toEqual([])
  })

  it('parses comma-separated and repeated query values', () => {
    expect(parseList('discord, reddit,discord')).toEqual(['discord', 'reddit'])
    expect(parseList(['discord', 'twitch,reddit'])).toEqual(['discord', 'twitch', 'reddit'])
    expect(parseList(undefined)).toEqual([])
  })

  it('accepts only real YYYY-MM-DD days', () => {
    expect(isDay('2026-10-13')).toBe(true)
    expect(isDay('2026-13-40')).toBe(false)
    expect(isDay('13/10/2026')).toBe(false)
  })

  it('turns content dates into days', () => {
    expect(isoDay(new Date('2026-10-06T00:00:00.000Z'))).toBe('2026-10-06')
    expect(isoDay('2025-07-01')).toBe('2025-07-01')
    expect(isoDay('not a date')).toBeUndefined()
  })

  it('treats a date range as inclusive', () => {
    expect(inRange('2026-03-05', '2026-03-05', '2026-03-05')).toBe(true)
    expect(inRange('2026-03-04', '2026-03-05', '')).toBe(false)
    expect(inRange(undefined, '', '')).toBe(true)
    expect(inRange(undefined, '2026-01-01', '')).toBe(false)
  })

  it('ORs within a facet and ANDs across facets', () => {
    const item = { platforms: ['discord'], category: 'tools' }
    expect(matchesFacets(item, { platforms: ['reddit', 'discord'], category: ['tools'] })).toBe(true)
    expect(matchesFacets(item, { platforms: ['discord'], category: ['compliance'] })).toBe(false)
    expect(matchesFacets(item, { platforms: ['discord'], category: ['compliance'] }, 'category')).toBe(true)
  })

  it('sorts by date or title and otherwise keeps the order', () => {
    const items = [{ title: 'B', date: '2026-01-01' }, { title: 'A', date: '2026-05-01' }]
    expect(sortItems(items, 'newest', 'date').map(item => item.title)).toEqual(['A', 'B'])
    expect(sortItems(items, 'oldest', 'date').map(item => item.title)).toEqual(['B', 'A'])
    expect(sortItems(items, 'title').map(item => item.title)).toEqual(['A', 'B'])
    expect(sortItems(items, 'relevance', 'date')).toBe(items)
  })
})
