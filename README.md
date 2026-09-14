# Tarea 3 — Uso de un CMS headless

**Autor:** Isaías Víquez Soto (402580631)
**Curso:** EIF-511 Arquitectura de Información

**Sitio publicado en Netlify:** `<pendiente — completar tras el despliegue>`

## Descripción

Adaptación del sitio de Proyecto 1 (medallero de los Juegos Olímpicos de Verano) para leer su contenido desde **Comet CMS** (`http://cms-una.gt.tc`) en lugar de un CSV local. El modelo de datos usa dos content types relacionados:

- **countries** (`noc`, `iso3`) — identidad de cada país.
- **results** (`country` → relación a `countries`, `year`, y las métricas por edición olímpica: medallas, atletas, población, PIB per cápita, etc.).

Todas las llamadas al CMS pasan por un proxy del lado del servidor (`server/api/comet/[...path].ts`) que agrega el token de autenticación — el token nunca llega al navegador.

## Desarrollo local

```bash
npm install
cp .env.example .env   # completar NUXT_COMET_API_TOKEN, NUXT_COMET_URL, NUXT_COMET_WORKSPACE
npm run dev
```

## Build y despliegue

```bash
npm run build
```

Build SSR (Nitro/Netlify Functions) — refleja cambios hechos en Comet CMS sin necesidad de un nuevo despliegue. En Netlify, configurar las variables `NUXT_COMET_API_TOKEN`, `NUXT_COMET_URL` y `NUXT_COMET_WORKSPACE` en Site settings → Environment variables.
