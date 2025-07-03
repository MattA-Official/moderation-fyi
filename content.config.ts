import { defineCollection, defineContentConfig, z } from '@nuxt/content'
import { asSeoCollection } from '@nuxtjs/seo/content'

export default defineContentConfig({
  collections: {
    articles: defineCollection(asSeoCollection({
      source: 'articles/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        publishedAt: z.date(),
        updatedAt: z.date().optional(),
        tags: z.array(z.string()).default([]),
        category: z.enum(['moderation', 'policy', 'technology', 'trends', 'case-study']),
        featured: z.boolean().default(false),
        readingTime: z.number().optional(),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
        image: z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        }).optional(),
        seo: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.array(z.string()).optional(),
        }).optional(),
        relatedArticles: z.array(z.string()).optional(),
      }),
    })),
    guides: defineCollection(asSeoCollection({
      source: 'guides/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        publishedAt: z.date(),
        updatedAt: z.date().optional(),
        tags: z.array(z.string()).default([]),
        category: z.enum(['implementation', 'best-practices', 'tools', 'compliance', 'getting-started']),
        difficulty: z.enum(['beginner', 'intermediate', 'advanced']).default('beginner'),
        estimatedTime: z.string().optional(), // e.g., "30 minutes", "2 hours"
        prerequisites: z.array(z.string()).default([]),
        tools: z.array(z.string()).default([]),
        image: z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        }).optional(),
        steps: z.array(z.object({
          title: z.string(),
          description: z.string().optional(),
        })).optional(),
        seo: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.array(z.string()).optional(),
        }).optional(),
        resources: z.array(z.object({
          title: z.string(),
          url: z.string(),
          type: z.enum(['documentation', 'tool', 'article', 'video']),
        })).optional(),
        featured: z.boolean().default(false),
      }),
    })),
    templates: defineCollection(asSeoCollection({
      source: 'templates/*.md',
      type: 'page',
      schema: z.object({
        title: z.string(),
        description: z.string(),
        author: z.string(),
        publishedAt: z.date(),
        updatedAt: z.date().optional(),
        tags: z.array(z.string()).default([]),
        category: z.enum(['policy', 'guidelines', 'forms', 'processes', 'documentation']),
        templateType: z.enum(['policy-document', 'guidelines', 'checklist', 'form', 'process', 'training']),
        industry: z.array(z.string()).default([]), // e.g., ['social-media', 'gaming', 'e-commerce']
        platform: z.array(z.string()).default([]), // e.g., ['web', 'mobile', 'api']
        compliance: z.array(z.string()).default([]), // e.g., ['GDPR', 'COPPA', 'DSA']
        downloadable: z.boolean().default(false),
        license: z.enum(['cc0', 'cc-by', 'cc-by-sa', 'proprietary']).default('cc-by'),
        image: z.object({
          src: z.string(),
          alt: z.string(),
          caption: z.string().optional(),
        }).optional(),
        seo: z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          keywords: z.array(z.string()).optional(),
        }).optional(),
        customization: z.object({
          difficulty: z.enum(['easy', 'moderate', 'complex']).default('easy'),
          estimatedTime: z.string().optional(),
          requirements: z.array(z.string()).default([]),
        }).optional(),
        featured: z.boolean().default(false),
      }),
    })),
    authors: defineCollection({
      source: 'authors/*.yml',
      type: 'data',
      schema: z.object({
        name: z.string(),
        bio: z.string(),
        image: z.string().optional(),
        social: z.object({
          twitter: z.string().optional(),
          github: z.string().optional(),
          website: z.string().optional(),
        }).optional(),
      }),
    }),
  },
})
