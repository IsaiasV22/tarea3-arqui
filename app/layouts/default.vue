<template>
  <div class="layout">
    <TheHeader />
    <main class="layout-main">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.layout-main {
  flex: 1;
  width: 100%;
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}
</style>
