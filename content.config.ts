import { defineCollection, defineContentConfig, property } from '@nuxt/content'
import { asSitemapCollection } from '@nuxtjs/sitemap/content'
import { z } from 'zod'

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
  tags: z.array(z.string()).default([]),
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
        platforms: z.array(z.string()).default([]), // e.g. ['discord', 'reddit', 'twitch']
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
        platforms: z.array(z.string()).default([]), // e.g. ['discord', 'reddit', 'twitch']
        compliance: z.array(z.string()).default([]), // e.g. ['GDPR', 'COPPA', 'DSA']
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
        team: z.boolean().default(false), // A group rather than a person, e.g. the moderation.fyi team
        moderatingSince: z.number().int().optional(), // Year, e.g. 2019
        platforms: z.array(z.string()).default([]), // e.g. ['discord', 'reddit']
        links: z.array(z.object({
          label: z.string(),
          url: z.url({ protocol: /^https?$/ }),
        })).default([]), // "Elsewhere" links on the bio page
        seo: seo.optional(),
      }),
    }, sitemap('authors', entry => !entry.link))),
  },
})
