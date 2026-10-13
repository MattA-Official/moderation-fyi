import type { InjectionKey, Ref } from 'vue'

// Placeholders are words in curly brackets, like {server name}, that a
// reader fills in once on the page; the filled text is what they copy.
const pattern = /\{([^{}\n]{1,60})\}/g

/**
 * A placeholder's key splits into the label shown and an optional tag:
 * {name:a} and {name:b} both read "name" but are filled in separately,
 * while every plain {name} shares one value.
 */
export function placeholderParts(key: string) {
  const tagged = key.match(/^(.+?):([A-Za-z0-9]+)$/)
  return tagged ? { label: tagged[1]!.trim(), tag: tagged[2]! } : { label: key, tag: '' }
}

/** A minimark node: text, or [tag, props, ...children] */
type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

// Text in these stays as written: code is shown literally, and a
// placeholder never nests
const literal = new Set(['code', 'pre', 'template-placeholder'])

/** Swaps each filled-in placeholder for its value; empty ones read {label}, without their tag */
export function fillPlaceholders(markdown: string, values: Record<string, string>) {
  return markdown.replace(pattern, (match, name: string) => {
    const key = name.trim()
    return values[key]?.trim() || (key ? `{${placeholderParts(key).label}}` : match)
  })
}

/**
 * Turns {name} in rendered template text into <template-placeholder> nodes,
 * which ContentRenderer shows with the TemplatePlaceholder component. With
 * `snippetsOnly`, only text inside template-snippet blocks changes, so the
 * guidance around them reads as written.
 */
export function markPlaceholders(nodes: MinimarkNode[], snippetsOnly = false, inSnippet = false): MinimarkNode[] {
  return nodes.flatMap((node): MinimarkNode[] => {
    if (typeof node === 'string') {
      if (snippetsOnly && !inSnippet) return [node]
      return node.split(pattern).flatMap((part, index): MinimarkNode[] => {
        if (index % 2) return part.trim() ? [['template-placeholder', { name: part.trim() }]] : [`{${part}}`]
        return part ? [part] : []
      })
    }
    const [tag, props, ...children] = node
    if (literal.has(tag)) return [node]
    return [[tag, props, ...markPlaceholders(children, snippetsOnly, inSnippet || tag === 'template-snippet')]]
  })
}

export type TemplatePlaceholders = {
  values: Ref<Record<string, string>>
  fillIn: (markdown: string) => string
}

export const templatePlaceholdersKey: InjectionKey<TemplatePlaceholders> = Symbol('template-placeholders')
