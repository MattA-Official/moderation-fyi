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
  // production bindings, and must not share the production database: Nuxt
  // Content rewrites its tables to match each deployment's content.
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
  modules: ['@nuxt/ui', '@nuxt/content', '@nuxt/eslint', '@nuxt/icon', '@nuxt/image', '@nuxtjs/seo', 'nuxt-studio'],

  devtools: { enabled: true },

  app: {
    head: {
      htmlAttrs: {
        lang: 'en-GB',
      },
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico', sizes: '48x48' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
        // The serif roman and the sans regular are on every page
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/SourceSerif4-latin-wght.woff2', crossorigin: '' },
        { rel: 'preload', as: 'font', type: 'font/woff2', href: '/fonts/AtkinsonHyperlegibleNext-latin-400.woff2', crossorigin: '' },
        { rel: 'alternate', type: 'application/rss+xml', title: 'moderation.fyi articles', href: '/rss.xml' },
      ],
      meta: [
        { name: 'theme-color', content: '#f7f5ef', media: '(prefers-color-scheme: light)' },
        { name: 'theme-color', content: '#141918', media: '(prefers-color-scheme: dark)' },
      ],
    },
  },

  css: ['~/assets/css/main.css'],

  // SEO Configuration
  site: {
    url: 'https://moderation.fyi',
    name: 'moderation.fyi',
    description: 'Practical moderation guides for volunteer community moderators. Open-source and community-driven.',
    defaultLocale: 'en-GB',
  },

  colorMode: {
    // Both themes are first-class: follow the reader's system setting
    preference: 'system',
    fallback: 'light',
  },

  content: {
    database: {
      type: 'd1',
      bindingName: 'DB',
    },
    build: {
      markdown: {
        toc: {
          depth: 3,
        },
        highlight: {
          theme: {
            default: 'github-light',
            dark: 'github-dark',
          },
        },
      },
    },
  },

  ui: {
    // Fonts are self-hosted from public/fonts (see main.css)
    fonts: false,
  },

  routeRules: {
    '/rss.xml': { prerender: true },
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
    prerender: {
      routes: ['/rss.xml'],
    },
  },

  eslint: {
    config: {
      stylistic: true,
    },
  },

  icon: {
    // The design system uses Lucide only. Icons are bundled; never fall back
    // to the public Iconify API.
    serverBundle: {
      collections: ['lucide'],
    },
    clientBundle: {
      scan: true,
    },
    fallbackToApi: false,
  },

  image: {
    // Serve images as-is: IPX can't run on Cloudflare Workers. Switch to the
    // `cloudflare` provider if Image Transformations get enabled on the zone.
    provider: 'none',
  },

  linkChecker: {
    enabled: true,
  },

  ogImage: {
    enabled: false, // Disabled because it's being problematic while deploying
  },

  robots: {
    enabled: true,
    blockNonSeoBots: true,
    disallow: ['/_studio'],
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
    automaticDefaults: true,
  },

  sitemap: {
    enabled: true,
    autoLastmod: true,
    exclude: ['/_studio/**', '/unsubscribe'],
  },

  studio: {
    // Studio admin route (default: '/_studio')
    route: '/_studio',

    repository: {
      provider: 'github',
      owner: 'MattA-Official',
      repo: 'moderation-fyi',
      branch: 'dev',
    },
  },
})
