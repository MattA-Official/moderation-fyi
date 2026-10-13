import type { InjectionKey, Ref } from 'vue'

// Placeholders are words in curly brackets, like {server name}, that a
// reader fills in once on the page; the filled text is what they copy.
const pattern = /\{([^{}\n]{1,60})\}/g

/** A minimark node: text, or [tag, props, ...children] */
type MinimarkNode = string | [string, Record<string, unknown>, ...MinimarkNode[]]

// Text in these stays as written: code is shown literally, and a
// placeholder never nests
const literal = new Set(['code', 'pre', 'template-placeholder'])

/** The placeholder names in some Markdown, in order of first appearance */
export function placeholderNames(markdown: string) {
  // Code is shown as written, so its {brackets} aren't placeholders
  const text = markdown.replace(/```[\s\S]*?```|`[^`\n]*`/g, '')
  return [...new Set([...text.matchAll(pattern)].map(match => match[1]!.trim()))].filter(Boolean)
}

/** Swaps each filled-in placeholder for its value; empty ones stay as {name} */
export function fillPlaceholders(markdown: string, values: Record<string, string>) {
  return markdown.replace(pattern, (match, name: string) => values[name.trim()]?.trim() || match)
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
