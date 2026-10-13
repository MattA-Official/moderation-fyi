import type { InjectionKey, Ref } from 'vue'

/**
 * Snippets in a template body, written as
 *
 *   ::template-snippet{title="Warning message"}
 *   The text people copy.
 *   ::
 *
 * keyed by title, so each snippet's copy button gets its Markdown.
 * Components nested in a snippet must use `:::` so `::` still closes it.
 */
export function templateSnippets(markdown: string) {
  const snippets = new Map<string, string>()
  for (const [, attributes, body] of markdown.matchAll(/^::template-snippet\{([^}\n]*)\}[ \t]*\n([\s\S]*?)\n::[ \t]*$/gm)) {
    const title = attributes!.match(/title=(?:"([^"]*)"|'([^']*)')/)
    if (title) snippets.set(title[1] ?? title[2]!, body!.trim())
  }
  return snippets
}

export const templateSnippetsKey: InjectionKey<Ref<Map<string, string>>> = Symbol('template-snippets')
