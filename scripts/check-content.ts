// Checks the topics, platforms and compliance IDs in content front matter.
// Nuxt Content doesn't enforce enums in the schema, so this does instead.
// - An unknown platform or compliance ID is an error (exit code 1).
// - An unknown topic is only a warning: a page can be tagged before its
//   topic file exists, and the site shows the ID until the file is added.
import { readdirSync, readFileSync } from 'node:fs'
import { basename, join, relative } from 'node:path'
import { compliance, platforms } from '../shared/taxonomy'

const root = join(import.meta.dirname, '..')
const content = join(root, 'content')

const topics = new Set(readdirSync(join(content, 'topics'))
  .filter(file => file.endsWith('.yml'))
  .map(file => basename(file, '.yml')))

const fields = {
  topics: { known: topics, fix: (id: string) => `add content/topics/${id}.yml or fix the page`, error: false },
  platforms: { known: new Set(Object.keys(platforms)), fix: () => 'use an ID from shared/taxonomy.ts', error: true },
  compliance: { known: new Set(Object.keys(compliance)), fix: () => 'use an ID from shared/taxonomy.ts', error: true },
}

function markdownFiles(dir: string): string[] {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name)
    if (entry.isDirectory()) return markdownFiles(path)
    return entry.name.endsWith('.md') ? [path] : []
  })
}

/** A top-level list from front matter, written as a block or inline list */
function listOf(frontMatter: string, key: string) {
  const inline = frontMatter.match(new RegExp(`^${key}:[ \\t]*\\[(.*)\\]`, 'm'))
  if (inline) return inline[1]!.split(',').map(clean).filter(Boolean)
  const block = frontMatter.match(new RegExp(`^${key}:.*\\r?\\n((?:[ \\t]+-.*\\r?\\n?)*)`, 'm'))
  return (block?.[1] ?? '').split(/\r?\n/).map(line => clean(line.replace(/^\s*-/, ''))).filter(Boolean)
}

function clean(value: string) {
  return value.replace(/#.*$/, '').trim().replace(/^['"]|['"]$/g, '')
}

let errors = 0
let warnings = 0
for (const folder of ['guides', 'templates', 'articles', 'authors']) {
  for (const file of markdownFiles(join(content, folder))) {
    const frontMatter = readFileSync(file, 'utf8').match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? ''
    for (const [key, field] of Object.entries(fields)) {
      for (const id of listOf(frontMatter, key)) {
        if (field.known.has(id)) continue
        const message = `${relative(root, file)}: unknown ${key} ID "${id}"; ${field.fix(id)}`
        if (field.error) {
          errors++
          console.error(`error: ${message}`)
        }
        else {
          warnings++
          console.warn(`warning: ${message}`)
        }
      }
    }
  }
}

console.log(`${errors} error${errors === 1 ? '' : 's'}, ${warnings} warning${warnings === 1 ? '' : 's'}`)
if (errors) process.exit(1)
