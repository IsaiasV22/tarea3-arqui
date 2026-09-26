export interface CountryRef {
  id: string
  slug: string
  noc: string
  iso3: string
}

export interface RecordRow {
  id: string
  country: CountryRef
  year: number
  population: number
  gdp_per_capita: number
  income_group: string
  host_country: number
  athletes_sent: number
  sports_participated: number
  events_participated: number
  female_athlete_percentage: number
  prev_total_medals: number
  prev_medals_per_athlete: number
  gold: number
  silver: number
  bronze: number
  total_medals: number
  medals_per_athlete: number
}

export const MEDAL_TIERS = ['0', '1-5', '6-15', '16+'] as const
export type MedalTier = (typeof MEDAL_TIERS)[number]

export function medalTierOf(totalMedals: number): MedalTier {
  if (totalMedals <= 0) return '0'
  if (totalMedals <= 5) return '1-5'
  if (totalMedals <= 15) return '6-15'
  return '16+'
}

type SortAccessor = keyof RecordRow | ((row: RecordRow) => string | number)

interface UseRecordsListOptions {
  sortBy?: SortAccessor
  sortOrder?: 'asc' | 'desc'
  pageSize?: number
}

function sortValue(row: RecordRow, sortBy: SortAccessor) {
  return typeof sortBy === 'function' ? sortBy(row) : row[sortBy]
}

export function useRecordsList(
  records: Ref<RecordRow[] | null | undefined>,
  options: UseRecordsListOptions = {}
) {
  const { sortBy = 'year', sortOrder = 'asc', pageSize = 12 } = options

  const search = ref('')
  const incomeGroup = ref('')
  const hostOnly = ref(false)
  const medalTier = ref('')
  const page = ref(1)

  const sorted = computed(() => {
    const list = [...(records.value ?? [])]
    list.sort((a, b) => {
      const av = sortValue(a, sortBy)
      const bv = sortValue(b, sortBy)
      if (av === bv) return 0
      const cmp = av > bv ? 1 : -1
      return sortOrder === 'asc' ? cmp : -cmp
    })
    return list
  })

  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    return sorted.value.filter((row) => {
      if (
        q &&
        !row.country?.noc?.toLowerCase().includes(q) &&
        !row.country?.iso3?.toLowerCase().includes(q)
      ) {
        return false
      }
      if (incomeGroup.value && row.income_group !== incomeGroup.value) return false
      if (hostOnly.value && row.host_country !== 1) return false
      if (medalTier.value && medalTierOf(row.total_medals) !== medalTier.value) return false
      return true
    })
  })

  watch([search, incomeGroup, hostOnly, medalTier], () => {
    page.value = 1
  })

  const totalPages = computed(() => Math.max(1, Math.ceil(filtered.value.length / pageSize)))

  const paged = computed(() => {
    const start = (page.value - 1) * pageSize
    return filtered.value.slice(start, start + pageSize)
  })

  const incomeGroups = computed(() => {
    return [...new Set((records.value ?? []).map((row) => row.income_group))].sort()
  })

  return {
    search,
    incomeGroup,
    hostOnly,
    medalTier,
    page,
    totalPages,
    filtered,
    paged,
    incomeGroups
  }
}
