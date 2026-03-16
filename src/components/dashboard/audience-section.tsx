import {
  Bar,
  BarChart,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import dayjs from 'dayjs'

import { useApiQuery } from '@/hooks/use-api'
import { fetchAudienceData } from '@/lib/analytics-data'
import { DateRangePicker } from '@/components/date-range-picker'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type AudienceSectionProps = {
  startDate: string
  endDate: string
  onRangeChange: (range: { from: Date; to: Date }) => void
}

const PIE_COLORS = ['#4361ee', '#7b93f5', '#a78bfa', '#c4b5fd']

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

function AudienceCardSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardContent>
        <Skeleton className="mb-4 h-4 w-28" />
        <Skeleton className="h-50 w-full" />
      </CardContent>
    </Card>
  )
}

export function AudienceSection({
  startDate,
  endDate,
  onRangeChange,
}: AudienceSectionProps) {
  const { data, isLoading } = useApiQuery(
    ['analytics-audience', startDate, endDate],
    () => fetchAudienceData(startDate, endDate),
  )

  return (
    <div className="space-y-6">
      {/* Section header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">Audience</h2>
          <p className="text-sm text-muted-foreground">
            Understand who&apos;s watching your content
          </p>
        </div>
        <DateRangePicker
          from={dayjs(startDate).toDate()}
          to={dayjs(endDate).toDate()}
          onRangeChange={onRangeChange}
        />
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Age Distribution */}
        {isLoading ? (
          <AudienceCardSkeleton />
        ) : (
          <Card size="sm" className="bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Age Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-50">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data?.ageGroups}>
                    <XAxis
                      dataKey="range"
                      tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 12 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis
                      tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 11 }}
                      tickFormatter={(v) => `${v}%`}
                      axisLine={false}
                      tickLine={false}
                      width={35}
                    />
                    <Tooltip
                      {...CHART_TOOLTIP_STYLE}
                      formatter={(value) => [`${value}%`, 'Viewers']}
                    />
                    <Bar
                      dataKey="percentage"
                      fill="#4361ee"
                      radius={[4, 4, 0, 0]}
                      maxBarSize={36}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Gender Split */}
        {isLoading ? (
          <AudienceCardSkeleton />
        ) : (
          <Card size="sm" className="bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Gender</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-50 w-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.genderSplit}
                        dataKey="percentage"
                        nameKey="label"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        strokeWidth={0}
                      >
                        {data?.genderSplit.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        {...CHART_TOOLTIP_STYLE}
                        formatter={(value) => [`${value}%`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3">
                  {data?.genderSplit.map((g, i) => (
                    <div key={g.label} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {g.label}:{' '}
                        <span className="font-medium text-foreground">
                          {g.percentage}%
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Device Type */}
        {isLoading ? (
          <AudienceCardSkeleton />
        ) : (
          <Card size="sm" className="bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Device Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <div className="h-50 w-50">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data?.deviceTypes}
                        dataKey="percentage"
                        nameKey="device"
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={80}
                        strokeWidth={0}
                      >
                        {data?.deviceTypes.map((_, i) => (
                          <Cell
                            key={i}
                            fill={PIE_COLORS[i % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        {...CHART_TOOLTIP_STYLE}
                        formatter={(value) => [`${value}%`]}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-col gap-3">
                  {data?.deviceTypes.map((d, i) => (
                    <div key={d.device} className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{
                          backgroundColor: PIE_COLORS[i % PIE_COLORS.length],
                        }}
                      />
                      <span className="text-sm text-muted-foreground">
                        {d.device}:{' '}
                        <span className="font-medium text-foreground">
                          {d.percentage}%
                        </span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Geography */}
        {isLoading ? (
          <AudienceCardSkeleton />
        ) : (
          <Card size="sm" className="bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle>Top Countries</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2.5">
                {data?.geography.map((geo) => (
                  <div key={geo.country} className="flex items-center gap-3">
                    <span className="w-28 truncate text-sm text-muted-foreground">
                      {geo.country}
                    </span>
                    <div className="relative h-2 flex-1 rounded-full bg-muted">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full bg-blue-500/60"
                        style={{ width: `${geo.percentage * 3}%` }}
                      />
                    </div>
                    <span className="w-12 text-right text-xs text-muted-foreground">
                      {geo.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
