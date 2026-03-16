import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'

import { useApiQuery } from '@/hooks/use-api'
import { fetchOverviewData } from '@/lib/analytics-data'
import { DateRangePicker } from '@/components/date-range-picker'
import { AnalyticsCard, StatCard } from '@/components/dashboard/analytics-card'

type OverviewSectionProps = {
  startDate: string
  endDate: string
  onRangeChange: (range: { from: Date; to: Date }) => void
}

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

const CHART_TOOLTIP_STYLE = {
  contentStyle: {
    backgroundColor: '#0f172a',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: '#fff',
    fontSize: '12px',
  },
  labelStyle: { color: 'rgba(255,255,255,0.7)' },
  cursor: { fill: 'rgba(255,255,255,0.04)' },
}

function ChartTooltipLabel(value: unknown) {
  return dayjs(String(value)).format('MMM D, YYYY')
}

export function OverviewSection({
  startDate,
  endDate,
  onRangeChange,
}: OverviewSectionProps) {
  const { data, isLoading } = useApiQuery(
    ['analytics-overview', startDate, endDate],
    () => fetchOverviewData(startDate, endDate),
  )

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Overview</h2>
          <p className="text-sm text-muted-foreground">
            Key metrics for your channel performance
          </p>
        </div>
        <DateRangePicker
          from={dayjs(startDate).toDate()}
          to={dayjs(endDate).toDate()}
          onRangeChange={onRangeChange}
        />
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard
          label="Total Views"
          value={data ? formatNumber(data.totalViews) : undefined}
          change={data?.viewsChange}
          isLoading={isLoading}
        />
        <StatCard
          label="Watch Time (hours)"
          value={data ? formatNumber(data.totalWatchTimeHours) : undefined}
          change={data?.watchTimeChange}
          isLoading={isLoading}
        />
        <StatCard
          label="Followers"
          value={data ? formatNumber(data.totalFollowers) : undefined}
          change={data?.followersChange}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Views */}
        <AnalyticsCard title="Views" isLoading={isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.views}>
              <defs>
                <linearGradient id="viewsGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4361ee" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4361ee" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={(v) => dayjs(v).format('MMM D')}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={formatNumber}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                labelFormatter={ChartTooltipLabel}
                formatter={(value) => [formatNumber(Number(value)), 'Views']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4361ee"
                strokeWidth={2}
                fill="url(#viewsGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* Watch Time */}
        <AnalyticsCard title="Watch Time" isLoading={isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.watchTimeHours}>
              <defs>
                <linearGradient id="watchGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#7b93f5" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#7b93f5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={(v) => dayjs(v).format('MMM D')}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={formatNumber}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                labelFormatter={ChartTooltipLabel}
                formatter={(value) => [`${value}h`, 'Watch Time']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#7b93f5"
                strokeWidth={2}
                fill="url(#watchGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* Followers */}
        <AnalyticsCard title="Followers" isLoading={isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.followers}>
              <defs>
                <linearGradient id="followersGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a78bfa" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#a78bfa" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="rgba(255,255,255,0.06)"
              />
              <XAxis
                dataKey="date"
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={(v) => dayjs(v).format('MMM D')}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                tickFormatter={formatNumber}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                labelFormatter={ChartTooltipLabel}
                formatter={(value) => [
                  formatNumber(Number(value)),
                  'Followers',
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#a78bfa"
                strokeWidth={2}
                fill="url(#followersGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>
    </div>
  )
}
