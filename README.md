# Tarea 3 — Uso de un CMS headless

**Autor:** Isaías Víquez Soto (402580631)
**Curso:** EIF-511 Arquitectura de Información

**Sitio publicado en Netlify:** https://tarea3-arqui-isaiasviquez.netlify.app/

## Descripción

Adaptación del sitio de Proyecto 1 (medallero de los Juegos Olímpicos de Verano) para leer su contenido desde **Comet CMS** (`http://cms-una.gt.tc`) en lugar de un CSV local. El modelo de datos usa dos content types relacionados:

- **countries** (`noc`, `iso3`) — identidad de cada país.
- **results** (`country` → relación a `countries`, `year`, y las métricas por edición olímpica: medallas, atletas, población, PIB per cápita, etc.).

Todas las llamadas al CMS pasan por un proxy del lado del servidor (`server/api/comet/[...path].ts`), que reenvía la petición a la API de Comet CMS y aplana los registros (`data` anidado) para que las páginas lean campos planos. Ningún acceso al CMS se hace directamente desde el navegador.

## Estructura de datos

| Content type | Campos |
| --- | --- |
| `olimpiadas-paises` | `noc`, `iso3` |
| `olimpiadas-resultados` | `country` (relación → `olimpiadas-paises`), `year`, `population`, `gdp_per_capita`, `income_group`, `host_country`, `athletes_sent`, `sports_participated`, `events_participated`, `female_athlete_percentage`, `prev_total_medals`, `prev_medals_per_athlete`, `gold`, `silver`, `bronze`, `total_medals`, `medals_per_athlete` |

Se cargaron 15 registros: 5 países (AUS, BRA, CHN, ARG, BDI) y 10 resultados (2 ediciones por país), cada resultado enlazado a su país mediante la relación `country`. Los resultados de un país se consultan con `filter[country]=<slug>` y las páginas por año usan `include=country` para traer el país en la misma llamada.

## Desarrollo local

```bash
npm install
cp .env.example .env
npm run dev
```

## Build y despliegue

```bash
npm run build
```

Build SSR (Nitro/Netlify Functions) — refleja cambios hechos en Comet CMS sin necesidad de un nuevo despliegue. En Netlify, configurar las variables `NUXT_COMET_API_TOKEN`, `NUXT_COMET_URL` y `NUXT_COMET_WORKSPACE` en Site settings → Environment variables.
