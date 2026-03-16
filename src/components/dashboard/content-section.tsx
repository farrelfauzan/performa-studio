import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'

import { useApiQuery } from '@/hooks/use-api'
import { fetchContentData } from '@/lib/analytics-data'
import { DateRangePicker } from '@/components/date-range-picker'
import { AnalyticsCard, StatCard } from '@/components/dashboard/analytics-card'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type ContentSectionProps = {
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

export function ContentSection({
  startDate,
  endDate,
  onRangeChange,
}: ContentSectionProps) {
  const { data, isLoading } = useApiQuery(
    ['analytics-content', startDate, endDate],
    () => fetchContentData(startDate, endDate),
  )

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Content</h2>
          <p className="text-sm text-muted-foreground">
            Performance metrics for your content
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
          label="Total Impressions"
          value={data ? formatNumber(data.totalImpressions) : undefined}
          change={data?.impressionsChange}
          isLoading={isLoading}
        />
        <StatCard
          label="Avg. Click-Through Rate"
          value={data ? `${data.avgCtr}%` : undefined}
          change={data?.ctrChange}
          isLoading={isLoading}
        />
        <StatCard
          label="Avg. View Duration"
          value={data?.avgDuration}
          change={data?.durationChange}
          isLoading={isLoading}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Impressions */}
        <AnalyticsCard title="Impressions" isLoading={isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data?.impressions}>
              <defs>
                <linearGradient id="impGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#4a7de0" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#4a7de0" stopOpacity={0} />
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
                width={45}
              />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                labelFormatter={ChartTooltipLabel}
                formatter={(value) => [
                  formatNumber(Number(value)),
                  'Impressions',
                ]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#4a7de0"
                strokeWidth={2}
                fill="url(#impGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* Click-Through Rate */}
        <AnalyticsCard
          title="Impressions Click-Through Rate"
          isLoading={isLoading}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.ctr.map((p) => ({
                ...p,
                value: +(p.value / 10).toFixed(1),
              }))}
            >
              <defs>
                <linearGradient id="ctrGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#3730a3" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#3730a3" stopOpacity={0} />
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
                tickFormatter={(v) => `${v}%`}
                axisLine={false}
                tickLine={false}
                width={40}
              />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                labelFormatter={ChartTooltipLabel}
                formatter={(value) => [`${value}%`, 'CTR']}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#3730a3"
                strokeWidth={2}
                fill="url(#ctrGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </AnalyticsCard>

        {/* Average View Duration */}
        <AnalyticsCard title="Average View Duration" isLoading={isLoading}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data?.avgViewDuration.map((p) => ({
                ...p,
                minutes: +(p.value / 60).toFixed(1),
              }))}
            >
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
                tickFormatter={(v) => `${v}m`}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip
                {...CHART_TOOLTIP_STYLE}
                labelFormatter={ChartTooltipLabel}
                formatter={(value) => [`${value} min`, 'Avg Duration']}
              />
              <Bar
                dataKey="minutes"
                fill="#4361ee"
                radius={[4, 4, 0, 0]}
                maxBarSize={24}
              />
            </BarChart>
          </ResponsiveContainer>
        </AnalyticsCard>
      </div>

      {/* Top Content Table */}
      <Card size="sm" className="bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Top Content</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Skeleton className="h-10 w-16 rounded bg-white/10" />
                  <div className="flex-1 space-y-1.5">
                    <Skeleton className="h-3 w-48 bg-white/10" />
                    <Skeleton className="h-2 w-24 bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 pr-4 text-xs font-medium text-muted-foreground">
                      Content
                    </th>
                    <th className="pb-3 px-4 text-xs font-medium text-muted-foreground text-right">
                      Views
                    </th>
                    <th className="pb-3 px-4 text-xs font-medium text-muted-foreground text-right">
                      Watch Time
                    </th>
                    <th className="pb-3 px-4 text-xs font-medium text-muted-foreground text-right">
                      Impressions
                    </th>
                    <th className="pb-3 px-4 text-xs font-medium text-muted-foreground text-right">
                      CTR
                    </th>
                    <th className="pb-3 pl-4 text-xs font-medium text-muted-foreground text-right">
                      Avg Duration
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {data?.topContent.map((content) => (
                    <tr key={content.id}>
                      <td className="py-3 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={content.thumbnail}
                            alt={content.title}
                            className="h-9 w-16 shrink-0 rounded object-cover"
                          />
                          <span className="text-sm font-medium truncate max-w-50">
                            {content.title}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {formatNumber(content.views)}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {formatNumber(content.watchTimeHours)}h
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {formatNumber(content.impressions)}
                      </td>
                      <td className="py-3 px-4 text-right text-muted-foreground">
                        {content.ctr}%
                      </td>
                      <td className="py-3 pl-4 text-right text-muted-foreground">
                        {content.avgViewDuration}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
