// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/content',
    '@nuxt/eslint',
    '@nuxt/fonts',
    '@nuxt/icon',
    '@nuxt/image',
  ],
  devtools: { enabled: true },

  css: ['~/assets/css/main.css'],

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
})
