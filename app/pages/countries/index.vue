<script setup lang="ts">
import type { CountryRef } from '~/composables/useRecordsList'

interface CometList<T> {
  data: T[]
  meta: { limit: number; offset: number; total: number }
}

const { data } = await useFetch<CometList<CountryRef>>('/api/comet/content/olimpiadas-paises', {
  query: { limit: 100 }
})

const countries = computed(() => {
  return [...(data.value?.data ?? [])].sort((a, b) => a.noc.localeCompare(b.noc))
})
</script>

<template>
  <div>
    <p class="breadcrumb"><NuxtLink to="/">Inicio</NuxtLink> / Países</p>
    <h1 class="page-title">Países</h1>
    <p class="page-subtitle">{{ countries.length }} países con al menos una participación en los Juegos de Verano en este conjunto de datos.</p>

    <div class="card-grid">
      <NuxtLink
        v-for="country in countries"
        :key="country.id"
        :to="`/countries/${country.noc}`"
        class="card-link"
      >
        {{ country.noc }}
        <span class="card-link-sub">{{ country.iso3 }}</span>
      </NuxtLink>
    </div>
  </div>
</template>
