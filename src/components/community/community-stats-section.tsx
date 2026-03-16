import { MessageCircle, Users } from 'lucide-react'
import { useApiQuery } from '@/hooks/use-api'
import { fetchCommunityStats } from '@/lib/community-data'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent } from '@/components/ui/card'

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

function StatCardSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardContent>
        <div className="flex items-center justify-between">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="size-4 rounded" />
        </div>
        <Skeleton className="mt-3 h-8 w-24" />
        <Skeleton className="mt-2 h-3 w-16" />
      </CardContent>
    </Card>
  )
}

export function CommunityStatsSection() {
  const { data, isLoading } = useApiQuery(
    'community-stats',
    fetchCommunityStats,
  )

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <StatCardSkeleton />
        <StatCardSkeleton />
      </div>
    )
  }

  const cards = [
    {
      label: 'Total Comments',
      value: formatNumber(data.totalComments),
      change: data.totalCommentsChange,
      icon: MessageCircle,
    },
    {
      label: 'Monthly Audience',
      value: formatNumber(data.monthlyAudience),
      change: data.monthlyAudienceChange,
      icon: Users,
    },
  ]

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card) => (
        <Card
          key={card.label}
          size="sm"
          className="bg-card/50 backdrop-blur-xl"
        >
          <CardContent>
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {card.label}
              </p>
              <card.icon className="size-4 text-muted-foreground/50" />
            </div>
            <div className="mt-1 flex items-end gap-2">
              <p className="text-2xl font-semibold text-foreground">
                {card.value}
              </p>
              <span
                className={`mb-0.5 text-xs font-medium ${card.change >= 0 ? 'text-green-400' : 'text-red-400'}`}
              >
                {card.change >= 0 ? '+' : ''}
                {card.change}%
              </span>
            </div>
            <p className="mt-1 text-xs text-muted-foreground/60">
              vs last month
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
