<template>
  <header class="site-header">
    <div class="site-header-inner">
      <NuxtLink to="/" class="site-title">
        <span class="rings" aria-hidden="true">●●●●●</span>
        Medallero de los Juegos Olímpicos de Verano
      </NuxtLink>
      <nav class="site-nav">
        <NuxtLink to="/countries">Países</NuxtLink>
        <NuxtLink to="/years">Años</NuxtLink>
        <NuxtLink to="/records">Todos los registros</NuxtLink>
        <NuxtLink to="/medals">Medallas</NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.site-header {
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
}

.site-header-inner {
  max-width: 1100px;
  margin: 0 auto;
  padding: 1rem 1.5rem;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.site-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 700;
  font-size: 1.1rem;
  color: var(--color-text);
  text-decoration: none;
}

.rings {
  color: var(--color-accent);
  letter-spacing: -2px;
}

.site-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 1.25rem;
}

.site-nav a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 500;
}

.site-nav a:hover,
.site-nav a.router-link-active {
  color: var(--color-accent);
}
</style>
