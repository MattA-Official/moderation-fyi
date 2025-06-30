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

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: '2025-05-15',

  eslint: {
    config: {
      stylistic: true,
    },
  },
})
