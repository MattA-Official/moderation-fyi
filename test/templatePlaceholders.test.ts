import { describe, expect, it } from 'vitest'
import { fillPlaceholders, markPlaceholders, placeholderNames, placeholderParts } from '../app/utils/templatePlaceholders'

describe('placeholderNames', () => {
  it('lists each placeholder once, in order', () => {
    expect(placeholderNames('Hi {name}, welcome to {server}. Bye {name}!')).toEqual(['name', 'server'])
  })

  it('skips code', () => {
    expect(placeholderNames('Run `{cmd}` in {channel}\n\n```\n{x}\n```')).toEqual(['channel'])
  })

  it('ignores empty brackets and ones spanning lines', () => {
    expect(placeholderNames('{} and {a\nb}')).toEqual([])
  })
})

describe('fillPlaceholders', () => {
  it('swaps filled placeholders and leaves empty ones', () => {
    expect(fillPlaceholders('Hi {name}, from {server}', { name: 'Sam', server: ' ' })).toBe('Hi Sam, from {server}')
  })
})

describe('tagged placeholders', () => {
  it('splits a tag off the label', () => {
    expect(placeholderParts('name:a')).toEqual({ label: 'name', tag: 'a' })
    expect(placeholderParts('name')).toEqual({ label: 'name', tag: '' })
    expect(placeholderParts('time: 5 mins')).toEqual({ label: 'time: 5 mins', tag: '' })
  })

  it('fills each tag separately and drops tags from empty ones', () => {
    expect(fillPlaceholders('{name:a} reported {name:b} to {name}', { 'name:a': 'Sam' })).toBe('Sam reported {name} to {name}')
  })

  it('lists tagged placeholders separately', () => {
    expect(placeholderNames('{name:a} and {name:b} and {name:a}')).toEqual(['name:a', 'name:b'])
  })
})

describe('markPlaceholders', () => {
  it('turns placeholders in text into placeholder nodes', () => {
    expect(markPlaceholders([['p', {}, 'Hi {name}!']])).toEqual([
      ['p', {}, 'Hi ', ['template-placeholder', { name: 'name' }], '!'],
    ])
  })

  it('leaves code alone', () => {
    const code = ['p', {}, ['code', {}, '{name}']] as const
    expect(markPlaceholders([[...code]])).toEqual([[...code]])
  })

  it('only marks snippets when asked to', () => {
    const nodes = [
      ['p', {}, 'Guide {x}'],
      ['template-snippet', { title: 'A' }, ['p', {}, 'Hi {name}']],
    ] as Parameters<typeof markPlaceholders>[0]
    expect(markPlaceholders(nodes, true)).toEqual([
      ['p', {}, 'Guide {x}'],
      ['template-snippet', { title: 'A' }, ['p', {}, 'Hi ', ['template-placeholder', { name: 'name' }]]],
    ])
  })
})
