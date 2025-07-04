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

  css: ['~/assets/css/main.css'],

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
    enabled: false,
    // defaults: {
    //   component: 'OgImageDefault',
    //   width: 1200,
    //   height: 630,
    //   alt: 'moderation.fyi - Practical moderation guides for volunteer community moderators. Open-source and community-driven.',
    // },
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
    redirectToCanonicalSiteUrl: true,
    automaticDefaults: true,
  },

  sitemap: {
    enabled: true,
    autoLastmod: true,
    strictNuxtContentPaths: true,
  },
})
