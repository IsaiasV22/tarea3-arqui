<script setup lang="ts">
import type { RecordRow } from '~/composables/useRecordsList'

interface CometList<T> {
  data: T[]
  meta: { limit: number; offset: number; total: number }
}

const { data } = await useFetch<CometList<RecordRow>>('/api/comet/content/olimpiadas-resultados', {
  query: { limit: 100 }
})

const years = computed(() => {
  const counts = new Map<number, number>()
  for (const row of data.value?.data ?? []) {
    counts.set(row.year, (counts.get(row.year) ?? 0) + 1)
  }
  return [...counts.entries()].sort((a, b) => a[0] - b[0])
})
</script>

<template>
  <div>
    <p class="breadcrumb"><NuxtLink to="/">Inicio</NuxtLink> / Años</p>
    <h1 class="page-title">Ediciones de los Juegos</h1>
    <p class="page-subtitle">{{ years.length }} ediciones de los Juegos de Verano en este conjunto de datos.</p>

    <div class="card-grid">
      <NuxtLink v-for="[year, count] in years" :key="year" :to="`/years/${year}`" class="card-link">
        {{ year }}
        <span class="card-link-sub">{{ count }} países</span>
      </NuxtLink>
    </div>
  </div>
</template>
