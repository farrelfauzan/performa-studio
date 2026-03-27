import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from 'recharts'
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  TrendingUp,
  Target,
  BookOpen,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { useStudentAnalytics } from '@/hooks/use-student-analytics'

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

export function StudentAnalyticsSection({
  studentId,
}: {
  studentId: string
}) {
  const { data: analytics, isLoading } = useStudentAnalytics(studentId)

  const stats = !analytics ? [] : [
    {
      label: 'Total',
      value: analytics.totalAssignments,
      icon: BookOpen,
      color: 'text-white/70',
      bg: 'bg-white/8',
    },
    {
      label: 'Completed',
      value: analytics.completedAssignments,
      icon: CheckCircle,
      color: 'text-green-400',
      bg: 'bg-green-500/10',
    },
    {
      label: 'In Progress',
      value: analytics.inProgressAssignments,
      icon: Clock,
      color: 'text-yellow-400',
      bg: 'bg-yellow-500/10',
    },
    {
      label: 'Overdue',
      value: analytics.overdueAssignments,
      icon: AlertTriangle,
      color: 'text-red-400',
      bg: 'bg-red-500/10',
    },
    {
      label: 'Completion',
      value: `${analytics.completionRate}%`,
      icon: Target,
      color: 'text-blue-400',
      bg: 'bg-blue-500/10',
    },
    {
      label: 'Avg Score',
      value: analytics.averageScore.toFixed(1),
      icon: TrendingUp,
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
    },
  ]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Analytics</h2>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Card
                key={i}
                className="bg-white/5 backdrop-blur-xl ring-white/12 animate-pulse"
              >
                <CardContent className="flex items-center gap-3 py-4">
                  <div className="h-9 w-9 shrink-0 rounded-lg bg-white/8" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-14 rounded bg-white/8" />
                    <div className="h-5 w-10 rounded bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            ))
          : stats.map((stat) => (
          <Card
            key={stat.label}
            className="bg-white/5 backdrop-blur-xl ring-white/12"
          >
            <CardContent className="flex items-center gap-3 py-4">
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}
              >
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-white/30">
                  {stat.label}
                </p>
                <p className={`text-lg font-bold ${stat.color}`}>
                  {stat.value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <Card className="bg-white/5 backdrop-blur-xl ring-white/12 animate-pulse">
            <CardContent className="pt-5">
              <div className="mb-4 h-4 w-28 rounded bg-white/8" />
              <div className="space-y-3">
                <div className="flex items-end gap-2">
                  {[60, 80, 40, 70].map((h, i) => (
                    <div key={i} className="flex-1 rounded-t bg-white/8" style={{ height: `${h}%`, minHeight: h * 1.8 }} />
                  ))}
                </div>
                <div className="flex justify-between">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-3 w-12 rounded bg-white/5" />
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-white/5 backdrop-blur-xl ring-white/12 animate-pulse">
            <CardContent className="pt-5">
              <div className="mb-4 h-4 w-24 rounded bg-white/8" />
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="h-3.5 w-40 rounded bg-white/8" />
                      <div className="h-2.5 w-20 rounded bg-white/5" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-white/8" />
                      <div className="h-3.5 w-8 rounded bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : !analytics ? (
        <p className="py-4 text-center text-sm text-white/40">No analytics data</p>
      ) : null}

      {/* Charts row */}
      {analytics && (
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {/* Weekly activity chart */}
        <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
          <CardContent className="pt-5">
            <h3 className="mb-4 text-sm font-medium text-white/60">
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analytics.weeklyActivity}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.06)"
                />
                <XAxis
                  dataKey="week"
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                  axisLine={{ stroke: 'rgba(255,255,255,0.1)' }}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip {...CHART_TOOLTIP_STYLE} />
                <Bar
                  dataKey="assigned"
                  fill="rgba(99,102,241,0.5)"
                  radius={[4, 4, 0, 0]}
                  name="Assigned"
                />
                <Bar
                  dataKey="completed"
                  fill="rgba(34,197,94,0.7)"
                  radius={[4, 4, 0, 0]}
                  name="Completed"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Recent scores */}
        <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
          <CardContent className="pt-5">
            <h3 className="mb-4 text-sm font-medium text-white/60">
              Recent Scores
            </h3>
            <div className="space-y-3">
              {analytics.recentScores.map((entry) => (
                <div
                  key={entry.content}
                  className="flex items-center gap-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm text-white/70">
                      {entry.content}
                    </p>
                    <p className="text-xs text-white/30">
                      {new Date(entry.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-20 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${entry.score}%`,
                          backgroundColor:
                            entry.score >= 80
                              ? 'rgb(34,197,94)'
                              : entry.score >= 60
                                ? 'rgb(234,179,8)'
                                : 'rgb(239,68,68)',
                        }}
                      />
                    </div>
                    <span
                      className={`w-10 text-right text-sm font-medium ${
                        entry.score >= 80
                          ? 'text-green-400'
                          : entry.score >= 60
                            ? 'text-yellow-400'
                            : 'text-red-400'
                      }`}
                    >
                      {entry.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      )}
    </div>
  )
}
