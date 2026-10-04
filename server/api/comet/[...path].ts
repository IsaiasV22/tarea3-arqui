import { createDecipheriv } from 'node:crypto'

const USER_AGENT = 'Mozilla/5.0 (compatible; Nuxt-Comet-Proxy)'

// El hosting gratuito responde un desafío JS (AES-CBC) que fija la cookie __test; se replica aquí.
let challengeCookie = ''

function solveChallenge(html: string) {
  const [key, iv, cipher] = [...html.matchAll(/toNumbers\("([0-9a-f]+)"\)/g)].map((m) => Buffer.from(m[1] ?? '', 'hex')) as [Buffer, Buffer, Buffer]
  const decipher = createDecipheriv('aes-128-cbc', key, iv).setAutoPadding(false)
  return Buffer.concat([decipher.update(cipher), decipher.final()]).toString('hex')
}

interface CometResponse {
  data: unknown
  meta?: unknown
}

// La API anida los campos en `data`; las páginas esperan registros planos.
function flatten(item: any): any {
  if (Array.isArray(item)) return item.map(flatten)
  if (!item || typeof item !== 'object') return item
  const { data, ...meta } = item
  const base = data && typeof data === 'object' && !Array.isArray(data) ? { ...meta, ...data } : item
  return Object.fromEntries(Object.entries(base).map(([k, v]) => [k, flatten(v)]))
}

export default defineEventHandler(async (event): Promise<CometResponse> => {
  const path = getRouterParam(event, 'path')
  const config = useRuntimeConfig()
  const url = `${config.cometUrl}/api/v1/workspaces/${config.cometWorkspace}/${path}`
  const query = getQuery(event)

  const request = () =>
    $fetch<string>(url, {
      query: challengeCookie ? { ...query, i: 1 } : query,
      headers: {
        'User-Agent': USER_AGENT,
        Authorization: `Bearer ${config.cometApiToken}`,
        ...(challengeCookie ? { Cookie: `__test=${challengeCookie}` } : {})
      },
      responseType: 'text'
    })

  let raw = await request()
  for (let attempt = 0; attempt < 2 && raw.includes('slowAES'); attempt++) {
    challengeCookie = solveChallenge(raw)
    raw = await request()
  }

  if (raw.includes('slowAES')) {
    throw createError({ statusCode: 502, statusMessage: 'No se pudo superar el desafío anti-bot de Comet CMS' })
  }

  const res = JSON.parse(raw) as CometResponse
  return { ...res, data: flatten(res.data) }
})
