// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
    '@nuxtjs/seo',
  ],

  devtools: { enabled: true },

  app: {
    head: {
      title: 'moderation.fyi', // default fallback title
      htmlAttrs: {
        lang: 'en',
      },
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      ],
    },
  },

  css: ['~/assets/css/main.css', '~/assets/css/layout.css'],

  // SEO Configuration
  site: {
    url: 'https://moderation.fyi',
    name: 'moderation.fyi',
    description: 'Practical moderation guides for volunteer community moderators. Open-source and community-driven.',
    defaultLocale: 'en',
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    renderer: {
      anchorLinks: false,
    },
    build: {
      markdown: {
        highlight: {
          theme: {
            default: 'github-dark',
            light: 'github-light', // TODO: Not currently used because I haven't add light mode support yet
            dark: 'github-dark',
          },
        },
      },
    },
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-05-15',

  nitro: {
    cloudflare: {
      wrangler: {
        name: 'moderation-fyi',
        routes: [
          {
            pattern: 'moderation.fyi',
            custom_domain: true,
          },
        ],
        d1_databases: [
          {
            binding: 'DB',
            database_name: 'moderation-fyi',
            database_id: '5f0bd2fb-5daa-4694-b845-374fcf87ecd3',
          },
        ],
      },
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  linkChecker: {
    enabled: true,
  },

  ogImage: {
    enabled: false, // Disabled because it's being problematic while deploying
    defaults: {
      component: 'OgImageDefault',
      width: 1200,
      height: 630,
      alt: 'moderation.fyi - Practical moderation guides for volunteer community moderators. Open-source and community-driven.',
    },
    compatibility: {
      prerender: {
        resvg: false, // Should fix a compatibility issue with Cloudflare Workers
      },
    },
  },

  robots: {
    enabled: true,
    blockNonSeoBots: true,
  },

  schemaOrg: {
    enabled: true,
    identity: {
      type: 'Organization',
      name: 'moderation.fyi',
      url: 'https://moderation.fyi',
      description: 'Practical moderation guides for volunteer community moderators. Open-source and community-driven.',
    },
  },

  seo: {
    // redirectToCanonicalSiteUrl: true,
    automaticDefaults: true,
  },

  sitemap: {
    enabled: true,
    autoLastmod: true,
  },
})
