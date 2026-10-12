import { defineCollection, defineContentConfig, property } from '@nuxt/content'
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

export default defineContentConfig({
  collections: {
    articles: defineCollection({
      source: 'articles/**/*.md',
      type: 'page',
      schema: z.object({
        ...base,
        date: z.date(),
        updatedAt: z.date().optional(),
        badge: z.object({ label: z.string().nonempty() }).optional(),
      }),
    }),
    guides: defineCollection({
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
    }),
    templates: defineCollection({
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
    }),
    pages: defineCollection({
      source: {
        include: 'pages/*.md',
        prefix: '/',
      },
      type: 'page',
      schema: z.object({
        seo: seo.optional(),
        updatedAt: z.date().optional(),
      }),
    }),
    authors: defineCollection({
      source: 'authors/*.yml',
      type: 'data',
      schema: z.object({
        name: z.string().nonempty(),
        description: z.string().nonempty(),
        avatar: z.object({
          src: property(z.string().nonempty()).editor({ input: 'media' }),
          alt: z.string().optional(),
        }),
        to: z.string().optional(),
        target: z.string().optional(),
      }),
    }),
  },
})
