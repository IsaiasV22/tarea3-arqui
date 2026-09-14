<script setup lang="ts">
import type { RecordRow } from '~/composables/useRecordsList'

interface CometList<T> {
  data: T[]
  meta: { limit: number; offset: number; total: number }
}

const { data } = await useFetch<CometList<RecordRow>>('/api/comet/content/olimpiadas-resultados', {
  query: { include: 'country', limit: 100 }
})
const records = computed(() => data.value?.data ?? [])

const { search, incomeGroup, hostOnly, page, totalPages, filtered, paged, incomeGroups } =
  useRecordsList(records, { sortBy: (row) => row.country.noc, sortOrder: 'asc', pageSize: 15 })
</script>

<template>
  <div>
    <p class="breadcrumb"><NuxtLink to="/">Inicio</NuxtLink> / Todos los registros</p>
    <h1 class="page-title">Todos los registros</h1>
    <p class="page-subtitle">
      Busca y filtra cada registro país&ndash;año ({{ records.length }} en total).
    </p>

    <div class="filters">
      <label>
        Buscar (NOC / ISO3)
        <input v-model="search" type="search" placeholder="ej. USA" autocomplete="off" />
      </label>
      <label>
        Grupo de ingreso
        <select v-model="incomeGroup">
          <option value="">Todos</option>
          <option v-for="group in incomeGroups" :key="group" :value="group">{{ group }}</option>
        </select>
      </label>
      <label class="checkbox-label">
        <input v-model="hostOnly" type="checkbox" />
        Solo país anfitrión
      </label>
    </div>

    <p class="page-subtitle">{{ filtered.length }} registros coinciden.</p>

    <div v-if="paged.length" class="table-wrapper">
      <table class="results-table">
        <thead>
          <tr>
            <th>NOC</th>
            <th>Año</th>
            <th>Grupo de ingreso</th>
            <th>Anfitrión</th>
            <th>Oro</th>
            <th>Plata</th>
            <th>Bronce</th>
            <th>Total de medallas</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="row in paged" :key="`${row.country.noc}-${row.year}`">
            <td><NuxtLink :to="`/countries/${row.country.noc}/${row.year}`">{{ row.country.noc }}</NuxtLink></td>
            <td>{{ row.year }}</td>
            <td>{{ row.income_group }}</td>
            <td>{{ row.host_country === 1 ? 'Sí' : '' }}</td>
            <td>{{ row.gold }}</td>
            <td>{{ row.silver }}</td>
            <td>{{ row.bronze }}</td>
            <td>{{ row.total_medals }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="empty-state">Ningún registro coincide con estos filtros.</p>

    <PaginationControls v-model:page="page" :total-pages="totalPages" />
  </div>
</template>
