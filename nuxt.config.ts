// https://nuxt.com/docs/api/configuration/nuxt-config

// Cloudflare Workers config, written to the generated wrangler.json. Kept out of
// the config literal because Nitro's bundled Wrangler types don't know about
// Worker Previews (`previews`, `previews_enabled`) yet.
const wrangler = {
  name: 'moderation-fyi',
  routes: [
    {
      pattern: 'moderation.fyi',
      custom_domain: true,
    },
    // Preview-only domain: each branch is served at <branch>.preview.moderation.fyi
    {
      pattern: 'preview.moderation.fyi',
      custom_domain: true,
      previews_enabled: true,
      enabled: false,
    },
  ],
  d1_databases: [
    {
      binding: 'DB',
      database_name: 'moderation-fyi',
      database_id: '5f0bd2fb-5daa-4694-b845-374fcf87ecd3',
    },
  ],
  observability: {
    logs: {
      enabled: true,
    },
  },
  // Settings for branch Previews (`wrangler preview`). Previews don't inherit
  // production bindings, and use their own database so test sign-ups (and, on
  // the full site, Nuxt Content's tables) never touch production.
  previews: {
    d1_databases: [
      {
        binding: 'DB',
        database_name: 'moderation-fyi-preview',
        database_id: '578ea7bf-fa06-4ca9-9f61-d10773d80c1a',
      },
    ],
    observability: {
      logs: {
        enabled: true,
      },
    },
  },
}

export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/seo'],

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

  compatibilityDate: '2026-10-01',

  nitro: {
    cloudflare: {
      wrangler,
    },
    experimental: {
      database: true,
    },
    database: {
      default: {
        connector: 'cloudflare-d1',
        options: {
          bindingName: 'DB',
        },
      },
    },
    devDatabase: {
      default: {
        connector: 'sqlite',
        options: {
          name: 'newsletter',
        },
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
    // redirectToCanonicalSiteUrl: true,
    automaticDefaults: true,
  },

  sitemap: {
    enabled: true,
    autoLastmod: true,
  },
})
