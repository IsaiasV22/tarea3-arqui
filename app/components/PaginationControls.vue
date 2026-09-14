<script setup lang="ts">
const props = defineProps<{
  page: number
  totalPages: number
}>()

const emit = defineEmits<{
  (e: 'update:page', value: number): void
}>()

function goTo(page: number) {
  if (page < 1 || page > props.totalPages || page === props.page) return
  emit('update:page', page)
}
</script>

<template>
  <div class="pagination" v-if="totalPages > 1">
    <button type="button" :disabled="page === 1" @click="goTo(page - 1)">
      &laquo; Anterior
    </button>
    <span class="pagination-status">Página {{ page }} de {{ totalPages }}</span>
    <button type="button" :disabled="page === totalPages" @click="goTo(page + 1)">
      Siguiente &raquo;
    </button>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.pagination button {
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  padding: 0.4rem 0.9rem;
  border-radius: 6px;
  cursor: pointer;
}

.pagination button:disabled {
  opacity: 0.4;
  cursor: default;
}

.pagination button:not(:disabled):hover {
  border-color: var(--color-accent);
  color: var(--color-accent);
}

.pagination-status {
  color: var(--color-text-muted);
  font-size: 0.9rem;
}
</style>
