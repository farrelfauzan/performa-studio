import { Link } from '@tanstack/react-router'
import { ArrowRight, Eye, Play, Users } from 'lucide-react'
import { useApiQuery } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'
import { DASHBOARD_STATS, type DashboardStat } from '@/lib/dummy-data'

const STAT_ICONS = [Play, Users, Eye] as const

async function fetchStats(): Promise<DashboardStat[]> {
  await new Promise((resolve) => setTimeout(resolve, 600))
  return DASHBOARD_STATS
}

function StatCardSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-24" />
          <Skeleton className="size-4 rounded" />
        </div>
        <Skeleton className="mt-3 h-7 w-20" />
        <Skeleton className="mt-3 h-3 w-28" />
      </CardContent>
    </Card>
  )
}

export function StatsSection() {
  const { data, isLoading } = useApiQuery('dashboard-stats', fetchStats)

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <StatCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {data.map((stat, i) => {
        const Icon = STAT_ICONS[i]
        return (
          <Link key={stat.label} to="/dashboard/analytics" search={{} as any}>
            <Card
              size="sm"
              className="group bg-card/50 backdrop-blur-xl transition-colors hover:bg-card/70"
            >
              <CardContent>
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    {stat.label}
                  </p>
                  <Icon className="size-4 text-muted-foreground/50 transition-colors group-hover:text-muted-foreground" />
                </div>
                <div className="mt-1 flex items-end gap-2">
                  <p className="text-2xl font-semibold text-foreground">
                    {stat.value}
                  </p>
                  {stat.change !== undefined && (
                    <span
                      className={`mb-0.5 text-xs font-medium ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
                    >
                      {stat.change >= 0 ? '+' : ''}
                      {stat.change}%
                    </span>
                  )}
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground/60 transition-colors group-hover:text-muted-foreground">
                  View analytics <ArrowRight className="size-3" />
                </p>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
