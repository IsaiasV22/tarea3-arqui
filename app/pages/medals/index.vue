<script setup lang="ts">
import type { RecordRow } from '~/composables/useRecordsList'
import { MEDAL_TIERS } from '~/composables/useRecordsList'

interface CometList<T> {
  data: T[]
  meta: { limit: number; offset: number; total: number }
}

const { data } = await useFetch<CometList<RecordRow>>('/api/comet/content/olimpiadas-resultados', {
  query: { include: 'country', limit: 100 }
})
const records = computed(() => data.value?.data ?? [])

const { search, medalTier, page, totalPages, filtered, paged } = useRecordsList(records, {
  sortBy: 'total_medals',
  sortOrder: 'desc',
  pageSize: 15
})
</script>

<template>
  <div>
    <p class="breadcrumb"><NuxtLink to="/">Inicio</NuxtLink> / Medallas</p>
    <h1 class="page-title">Tabla de medallas</h1>
    <p class="page-subtitle">Todos los registros clasificados por total de medallas ganadas, de mayor a menor.</p>

    <div class="filters">
      <label>
        Buscar (NOC / ISO3)
        <input v-model="search" type="search" placeholder="ej. USA" autocomplete="off" />
      </label>
      <label>
        Rango de medallas
        <select v-model="medalTier">
          <option value="">Todos</option>
          <option v-for="tier in MEDAL_TIERS" :key="tier" :value="tier">{{ tier }} medallas</option>
        </select>
      </label>
    </div>

    <p class="page-subtitle">{{ filtered.length }} registros coinciden.</p>

    <div v-if="paged.length" class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            <th>Posición</th>
            <th>NOC</th>
            <th>Año</th>
            <th>Oro</th>
            <th>Plata</th>
            <th>Bronce</th>
            <th>Total de medallas</th>
            <th>Medallas / atleta</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, index) in paged" :key="`${row.country.noc}-${row.year}`">
            <td>{{ (page - 1) * 15 + index + 1 }}</td>
            <td><NuxtLink :to="`/countries/${row.country.noc}/${row.year}`">{{ row.country.noc }}</NuxtLink></td>
            <td>{{ row.year }}</td>
            <td>{{ row.gold }}</td>
            <td>{{ row.silver }}</td>
            <td>{{ row.bronze }}</td>
            <td>{{ row.total_medals }}</td>
            <td>{{ row.medals_per_athlete.toFixed(3) }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="empty-state">Ningún registro coincide con estos filtros.</p>

    <PaginationControls v-model:page="page" :total-pages="totalPages" />
  </div>
</template>
