import {
  createFileRoute,
  useNavigate,
  stripSearchParams,
} from '@tanstack/react-router'
import dayjs from 'dayjs'

import { OverviewSection } from '@/components/dashboard/overview-section'
import { ContentSection } from '@/components/dashboard/content-section'
import { AudienceSection } from '@/components/dashboard/audience-section'
import { Separator } from '@/components/ui/separator'

type AnalyticsSearch = {
  ovStart: string
  ovEnd: string
  ctStart: string
  ctEnd: string
  auStart: string
  auEnd: string
}

const DEFAULT_START = dayjs().subtract(30, 'day').format('YYYY-MM-DD')
const DEFAULT_END = dayjs().format('YYYY-MM-DD')

const SEARCH_DEFAULTS: AnalyticsSearch = {
  ovStart: DEFAULT_START,
  ovEnd: DEFAULT_END,
  ctStart: DEFAULT_START,
  ctEnd: DEFAULT_END,
  auStart: DEFAULT_START,
  auEnd: DEFAULT_END,
}

export const Route = createFileRoute('/(dashboard)/dashboard/analytics')({
  component: AnalyticsPage,
  validateSearch: (search: Record<string, unknown>): AnalyticsSearch => ({
    ovStart: (search.ovStart as string) || SEARCH_DEFAULTS.ovStart,
    ovEnd: (search.ovEnd as string) || SEARCH_DEFAULTS.ovEnd,
    ctStart: (search.ctStart as string) || SEARCH_DEFAULTS.ctStart,
    ctEnd: (search.ctEnd as string) || SEARCH_DEFAULTS.ctEnd,
    auStart: (search.auStart as string) || SEARCH_DEFAULTS.auStart,
    auEnd: (search.auEnd as string) || SEARCH_DEFAULTS.auEnd,
  }),
  search: {
    middlewares: [stripSearchParams(SEARCH_DEFAULTS)],
  },
})

function AnalyticsPage() {
  const search = Route.useSearch()
  const navigate = useNavigate({ from: Route.fullPath })

  function setSearch(updates: Partial<AnalyticsSearch>) {
    navigate({ search: (prev) => ({ ...prev, ...updates }), replace: true })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="mt-1 text-sm text-white/50">
          Track your channel performance, content metrics, and audience
          insights.
        </p>
      </div>

      {/* Overview */}
      <OverviewSection
        startDate={search.ovStart}
        endDate={search.ovEnd}
        onRangeChange={({ from, to }) =>
          setSearch({
            ovStart: dayjs(from).format('YYYY-MM-DD'),
            ovEnd: dayjs(to).format('YYYY-MM-DD'),
          })
        }
      />

      <Separator className="bg-white/8" />

      {/* Content */}
      <ContentSection
        startDate={search.ctStart}
        endDate={search.ctEnd}
        onRangeChange={({ from, to }) =>
          setSearch({
            ctStart: dayjs(from).format('YYYY-MM-DD'),
            ctEnd: dayjs(to).format('YYYY-MM-DD'),
          })
        }
      />

      <Separator className="bg-white/8" />

      {/* Audience */}
      <AudienceSection
        startDate={search.auStart}
        endDate={search.auEnd}
        onRangeChange={({ from, to }) =>
          setSearch({
            auStart: dayjs(from).format('YYYY-MM-DD'),
            auEnd: dayjs(to).format('YYYY-MM-DD'),
          })
        }
      />
    </div>
  )
}
