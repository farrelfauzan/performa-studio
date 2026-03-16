import { Clock } from 'lucide-react'
import { useApiQuery } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { DASHBOARD_ACTIVITY, type ActivityItem } from '@/lib/dummy-data'

async function fetchActivity(): Promise<ActivityItem[]> {
  await new Promise((resolve) => setTimeout(resolve, 500))
  return DASHBOARD_ACTIVITY.slice(0, 3)
}

function ActivitySkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <Skeleton className="size-8 shrink-0 rounded-full" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-2.5 w-24" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function RecentActivitySection() {
  const { data, isLoading } = useApiQuery('dashboard-activity', fetchActivity)

  if (isLoading || !data) {
    return <ActivitySkeleton />
  }

  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {data.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
            >
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/15 text-primary">
                <Clock className="size-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm">
                  {item.action} &mdash;{' '}
                  <span className="text-muted-foreground">{item.target}</span>
                </p>
                <p className="text-xs text-muted-foreground/60">{item.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
