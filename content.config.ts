import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { z } from 'zod'
import { complianceIds, platformIds } from './shared/taxonomy'

const image = z.object({
  src: property(z.string().nonempty()).editor({ input: 'media' }),
  alt: z.string().optional(),
  caption: z.string().optional(),
})

const seo = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
})

// Shared by guides, templates and articles
const base = {
  authors: z.array(z.string()).default(['moderation-team']), // Author IDs from the authors collection
  topics: z.array(z.string()).default([]), // Topic IDs from the topics collection
  platforms: z.array(z.enum(platformIds)).default([]), // IDs from shared/taxonomy.ts, e.g. ['discord', 'reddit']
  image: image.optional(),
  seo: seo.optional(),
  featured: z.boolean().default(false),
}

type Dated = { updatedAt?: Date | string, publishedAt?: Date | string, date?: Date | string }

// Every content page goes in the sitemap, with its newest date as lastmod
function sitemap(name: string, filter?: (entry: Record<string, unknown>) => boolean) {
  return {
    name,
    filter,
    onUrl(url: { lastmod?: string | Date }, entry: Dated) {
      const lastmod = entry.updatedAt ?? entry.publishedAt ?? entry.date
      if (lastmod) url.lastmod = new Date(lastmod).toISOString()
    },
  }
}

export default defineContentConfig({
  collections: {
    articles: defineCollection(asSitemapCollection({
      source: 'articles/**/*.md',
      type: 'page',
      schema: z.object({
        ...base,
        date: z.date(),
        updatedAt: z.date().optional(),
        badge: z.object({ label: z.string().nonempty() }).optional(),
      }),
    }, sitemap('articles'))),
    guides: defineCollection(asSitemapCollection({
      source: 'guides/**/*.md',
      type: 'page',
      schema: z.object({
        ...base,
        publishedAt: z.date(),
        updatedAt: z.date().optional(),
        category: z.enum(['getting-started', 'best-practices', 'implementation', 'tools', 'compliance']),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
        estimatedTime: z.string().optional(), // e.g. "30 minutes", "2 hours"
        prerequisites: z.array(z.string()).default([]),
        tools: z.array(z.string()).default([]),
        resources: z.array(z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(['documentation', 'tool', 'article', 'video']),
        })).default([]),
      }),
    }, sitemap('guides'))),
    templates: defineCollection(asSitemapCollection({
      source: 'templates/**/*.md',
      type: 'page',
      schema: z.object({
        ...base,
        publishedAt: z.date(),
        updatedAt: z.date().optional(),
        category: z.enum(['policy', 'guidelines', 'forms', 'processes', 'documentation']),
        templateType: z.enum(['policy-document', 'guidelines', 'checklist', 'form', 'process', 'training', 'message']),
        compliance: z.array(z.enum(complianceIds)).default([]), // IDs from shared/taxonomy.ts, e.g. ['gdpr', 'dsa']
        downloadable: z.boolean().default(true),
        license: z.enum(['cc-by-nc-sa', 'cc0', 'cc-by', 'cc-by-sa']).default('cc-by-nc-sa'),
        customization: z.object({
          difficulty: z.enum(['easy', 'moderate', 'complex']).default('easy'),
          estimatedTime: z.string().optional(),
          requirements: z.array(z.string()).default([]),
        }).optional(),
        rawbody: z.string(), // Populated automatically; used by the copy/download buttons
      }),
    }, sitemap('templates'))),
    pages: defineCollection(asSitemapCollection({
      source: {
        include: 'pages/*.md',
        prefix: '/',
      },
      type: 'page',
      schema: z.object({
        seo: seo.optional(),
        updatedAt: z.date().optional(),
      }),
    }, sitemap('pages'))),
    // One YAML file per topic, referenced by file name from a page's `topics`.
    // Add a file here to add a topic; `bun run check:content` warns about
    // pages that name a topic with no file.
    topics: defineCollection({
      source: 'topics/*.yml',
      type: 'data',
      schema: z.object({
        label: z.string().nonempty(),
        description: z.string().nonempty(), // One line
      }),
    }),
    // One Markdown file per author, referenced by file name. An author either
    // writes a bio in the body (shown at /authors/<file>) or sets `link` to
    // point readers at their own site or profile instead.
    authors: defineCollection(asSitemapCollection({
      source: 'authors/*.md',
      type: 'page',
      schema: z.object({
        name: z.string().nonempty(),
        description: z.string().nonempty(), // One line, shown in bylines and the directory
        avatar: z.object({
          src: property(z.string().nonempty()).editor({ input: 'media' }),
          alt: z.string().optional(),
        }).optional(), // Falls back to initials
        link: z.url({ protocol: /^https?$/ }).optional(), // Personal site or profile, used instead of a bio page
        pronouns: z.string().optional(),
        moderatingSince: z.number().int().optional(), // Year, e.g. 2019
        platforms: z.array(z.enum(platformIds)).default([]), // IDs from shared/taxonomy.ts, e.g. ['discord', 'reddit']
        links: z.array(z.object({
          label: z.string(),
          url: z.url({ protocol: /^https?$/ }),
        })).default([]), // "Elsewhere" links on the bio page
        seo: seo.optional(),
      }),
    }, sitemap('authors', entry => !entry.link))),
  },
})
