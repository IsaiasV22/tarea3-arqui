<script setup lang="ts">
import type { CountryRef, RecordRow } from '~/composables/useRecordsList'

interface CometList<T> {
  data: T[]
  meta: { limit: number; offset: number; total: number }
}

const route = useRoute()
const noc = computed(() => String(route.params.noc).toUpperCase())
const year = computed(() => Number(route.params.year))

const { data: countryData } = await useAsyncData(
  () => `country-detail-${noc.value}-${year.value}`,
  async () => {
    const countryRes = await $fetch<CometList<CountryRef>>('/api/comet/content/olimpiadas-paises', {
      query: { 'filter[noc]': noc.value, limit: 1 }
    })
    const country = countryRes.data[0] ?? null
    if (!country) return { country: null, rows: [] as RecordRow[] }

    const resultsRes = await $fetch<CometList<RecordRow>>('/api/comet/content/olimpiadas-resultados', {
      query: { 'filter[country]': country.id, limit: 100 }
    })
    const rows = [...resultsRes.data].sort((a, b) => a.year - b.year)
    return { country, rows }
  },
  { watch: [noc] }
)

const country = computed(() => countryData.value?.country ?? null)
const rows = computed(() => countryData.value?.rows ?? [])

const record = computed(() => rows.value.find((row) => row.year === year.value) ?? null)

if (!country.value || !record.value) {
  throw createError({
    statusCode: 404,
    statusMessage: `No se encontró un registro para ${noc.value} en ${year.value}`
  })
}

const currentIndex = computed(() => rows.value.findIndex((row) => row.year === year.value))

const prevYear = computed(() => {
  return currentIndex.value > 0 ? rows.value[currentIndex.value - 1].year : null
})

const nextYear = computed(() => {
  return currentIndex.value >= 0 && currentIndex.value < rows.value.length - 1
    ? rows.value[currentIndex.value + 1].year
    : null
})
</script>

<template>
  <div v-if="record && country">
    <p class="breadcrumb">
      <NuxtLink to="/">Inicio</NuxtLink> /
      <NuxtLink to="/countries">Países</NuxtLink> /
      <NuxtLink :to="`/countries/${noc}`">{{ noc }}</NuxtLink> /
      {{ year }}
    </p>

    <h1 class="page-title">
      {{ noc }} &mdash; {{ year }}
      <span v-if="record.host_country === 1" class="badge">País anfitrión</span>
    </h1>
    <p class="page-subtitle">ISO3: {{ country.iso3 }} &middot; Grupo de ingreso: {{ record.income_group }}</p>

    <section class="stat-grid">
      <div class="stat-box">
        <span class="stat-label">Oro</span>
        <span class="stat-value">
          <span class="medal-count"><span class="medal-dot gold" />{{ record.gold }}</span>
        </span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Plata</span>
        <span class="stat-value">
          <span class="medal-count"><span class="medal-dot silver" />{{ record.silver }}</span>
        </span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Bronce</span>
        <span class="stat-value">
          <span class="medal-count"><span class="medal-dot bronze" />{{ record.bronze }}</span>
        </span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Total de medallas</span>
        <span class="stat-value">{{ record.total_medals }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Medallas por atleta</span>
        <span class="stat-value">{{ record.medals_per_athlete.toFixed(3) }}</span>
      </div>
    </section>

    <section class="stat-grid">
      <div class="stat-box">
        <span class="stat-label">Atletas enviados</span>
        <span class="stat-value">{{ record.athletes_sent }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Deportes en los que participó</span>
        <span class="stat-value">{{ record.sports_participated }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Eventos en los que participó</span>
        <span class="stat-value">{{ record.events_participated }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Atletas femeninas</span>
        <span class="stat-value">{{ record.female_athlete_percentage.toFixed(1) }}%</span>
      </div>
    </section>

    <h2>Contexto</h2>
    <section class="stat-grid">
      <div class="stat-box">
        <span class="stat-label">Población</span>
        <span class="stat-value">{{ record.population.toLocaleString() }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">PIB per cápita</span>
        <span class="stat-value">${{ record.gdp_per_capita.toFixed(0) }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Total de medallas anterior</span>
        <span class="stat-value">{{ record.prev_total_medals }}</span>
      </div>
      <div class="stat-box">
        <span class="stat-label">Medallas/atleta anterior</span>
        <span class="stat-value">{{ record.prev_medals_per_athlete.toFixed(3) }}</span>
      </div>
    </section>

    <nav class="detail-nav">
      <NuxtLink v-if="prevYear !== null" :to="`/countries/${noc}/${prevYear}`">
        &laquo; {{ noc }} {{ prevYear }}
      </NuxtLink>
      <span v-else class="disabled">&laquo; Sin registro anterior</span>

      <NuxtLink v-if="nextYear !== null" :to="`/countries/${noc}/${nextYear}`">
        {{ noc }} {{ nextYear }} &raquo;
      </NuxtLink>
      <span v-else class="disabled">Sin registro posterior &raquo;</span>
    </nav>
  </div>
</template>
