// Nuxt configuration for modules, CSS, and app-wide settings.

export default defineNuxtConfig({
  devtools: { enabled: true },

  modules: [
    '@pinia/nuxt', "@nuxt/icon",'@nuxtjs/tailwindcss',
  ],

  css: ['~/assets/css/tailwind.css'],

  app: {
    head: {
      title: 'Maturity Assessment MVP',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1' }
      ],
    }
  },
  icon: {
    provider: 'server',
    serverBundle: {
      collections: [
        'lucide',
        'fa6-solid',
        'fa6-brands',
        'ic',
        'logos',
        'material-symbols',
        'mdi',
        'skill-icons',
        'ph'
      ]
    }
  },
  runtimeConfig: {
    apiBase: 'http://127.0.0.1:3001/api/v1',
    public: {
      apiBase: 'http://127.0.0.1:3001/api/v1',
      demoMode: false,
    }
  }
})
