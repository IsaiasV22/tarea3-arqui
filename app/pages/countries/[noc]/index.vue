<script setup lang="ts">
import type { CountryRef, RecordRow } from '~/composables/useRecordsList'

interface CometList<T> {
  data: T[]
  meta: { limit: number; offset: number; total: number }
}

const route = useRoute()
const noc = computed(() => String(route.params.noc).toUpperCase())

const { data: countryData } = await useAsyncData(
  () => `country-${noc.value}`,
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

if (!countryData.value?.country || !countryData.value.rows.length) {
  throw createError({ statusCode: 404, statusMessage: `No se encontraron registros para el país "${noc.value}"` })
}

const appearances = computed(() => countryData.value?.rows ?? [])
</script>

<template>
  <div>
    <p class="breadcrumb">
      <NuxtLink to="/">Inicio</NuxtLink> / <NuxtLink to="/countries">Países</NuxtLink> / {{ noc }}
    </p>
    <h1 class="page-title">{{ noc }}</h1>
    <p class="page-subtitle">{{ appearances.length }} participaciones en los Juegos de Verano en este conjunto de datos.</p>

    <div class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            <th>Año</th>
            <th>Anfitrión</th>
            <th>Atletas</th>
            <th>Oro</th>
            <th>Plata</th>
            <th>Bronce</th>
            <th>Total de medallas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in appearances" :key="row.year">
            <td><NuxtLink :to="`/countries/${noc}/${row.year}`">{{ row.year }}</NuxtLink></td>
            <td>{{ row.host_country === 1 ? 'Sí' : '' }}</td>
            <td>{{ row.athletes_sent }}</td>
            <td>{{ row.gold }}</td>
            <td>{{ row.silver }}</td>
            <td>{{ row.bronze }}</td>
            <td>{{ row.total_medals }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
