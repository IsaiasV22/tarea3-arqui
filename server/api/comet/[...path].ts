// La API anida los campos en `data`; las páginas esperan registros planos.
function flatten(item: any): any {
  if (Array.isArray(item)) return item.map(flatten)
  if (!item || typeof item !== 'object') return item
  const { data, ...meta } = item
  const base = data && typeof data === 'object' && !Array.isArray(data) ? { ...meta, ...data } : item
  return Object.fromEntries(Object.entries(base).map(([k, v]) => [k, flatten(v)]))
}

interface CometResponse {
  data: unknown
  meta?: unknown
}

export default defineEventHandler(async (event): Promise<CometResponse> => {
  const path = getRouterParam(event, 'path')
  const config = useRuntimeConfig()

  const res = await $fetch<CometResponse>(`${config.cometUrl}/api/v1/workspaces/${config.cometWorkspace}/${path}`, {
    query: getQuery(event),
    headers: { Authorization: `Bearer ${config.cometApiToken}` },
  })

  return { ...res, data: flatten(res.data) }
})
