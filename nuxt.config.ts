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
    preset: 'cloudflare_module',
    cloudflare: {
      deployConfig: true,
      nodeCompat: true,
      wrangler: {
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

})
