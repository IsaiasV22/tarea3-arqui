// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    cometApiToken: '',
    cometUrl: 'https://mi-cms.example.com',
    cometWorkspace: 'default'
  },
  app: {
    head: {
      htmlAttrs: { lang: 'es' },
      title: 'Medallero de los Juegos Olímpicos de Verano',
      meta: [
        {
          name: 'description',
          content: 'Explora el medallero de los Juegos Olímpicos de Verano por país, año y total de medallas.'
        }
      ]
    }
  }
})
