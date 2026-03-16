import { Link } from '@tanstack/react-router'
import { CheckCircle2, Clock, Crown, Users, XCircle } from 'lucide-react'
import { useApiQuery } from '@/hooks/use-api'
import { fetchSubscriptionTiers, getFeatureLabels } from '@/lib/community-data'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

function formatNumber(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

const STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    className: 'bg-green-500/15 text-green-400 border-transparent',
    icon: CheckCircle2,
  },
  pending: {
    label: 'Pending Approval',
    className: 'bg-amber-500/15 text-amber-400 border-transparent',
    icon: Clock,
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-400 border-transparent',
    icon: XCircle,
  },
}

function SubscriptionSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Membership Tiers</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-xl border border-border/50 bg-card/30 p-4"
            >
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-8 w-24" />
              <div className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-3/4" />
                <Skeleton className="h-3 w-5/6" />
              </div>
              <Skeleton className="h-3 w-20" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SubscriptionSection() {
  const { data, isLoading } = useApiQuery(
    'community-subscriptions',
    fetchSubscriptionTiers,
  )

  if (isLoading) {
    return <SubscriptionSkeleton />
  }

  if (!data || data.length === 0) {
    return (
      <Card size="sm" className="bg-card/50 backdrop-blur-xl">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <div className="rounded-full bg-primary/10 p-3">
            <Crown className="size-6 text-primary" />
          </div>
          <h3 className="mt-4 text-sm font-medium">No Subscription Tiers</h3>
          <p className="mt-1 max-w-sm text-center text-xs text-muted-foreground">
            Create up to 3 membership tiers to monetize your community.
            Differentiate with ad-free viewing, badges, early access, and direct
            messaging.
          </p>
          <Button asChild size="sm" className="mt-4">
            <Link to="/dashboard/community/subscription-create">
              Create Tiers
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Membership Tiers</CardTitle>
        <CardAction>
          <Button asChild variant="outline" size="sm" className="h-7 text-xs">
            <Link to="/dashboard/community/subscription-edit">Edit Tiers</Link>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {data.map((tier) => {
            const status = STATUS_CONFIG[tier.approvalStatus]
            const StatusIcon = status.icon
            const benefits = getFeatureLabels(tier.features)

            return (
              <div
                key={tier.id}
                className="relative space-y-3 rounded-xl border border-border/50 bg-card/30 p-4 transition-colors hover:border-border"
              >
                {tier.price > 0 && tier.name === 'VIP' && (
                  <div className="absolute -top-2 right-3">
                    <Badge className="gap-1 bg-amber-500/15 text-amber-400 border-transparent text-[10px]">
                      <Crown className="size-3" />
                      Popular
                    </Badge>
                  </div>
                )}

                <div className="flex items-center gap-1.5">
                  <Badge className={`gap-1 text-[10px] ${status.className}`}>
                    <StatusIcon className="size-3" />
                    {status.label}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-medium">{tier.name}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground/60">
                    {tier.description}
                  </p>
                  <p className="mt-1 text-2xl font-semibold">
                    {tier.price === 0 ? (
                      'Free'
                    ) : (
                      <>
                        ${tier.price}
                        <span className="text-sm font-normal text-muted-foreground">
                          /mo
                        </span>
                      </>
                    )}
                  </p>
                </div>

                <ul className="space-y-1.5">
                  {benefits.map((benefit) => (
                    <li
                      key={benefit}
                      className="flex items-start gap-2 text-xs text-muted-foreground"
                    >
                      <span className="mt-0.5 text-primary">•</span>
                      {benefit}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center gap-1.5 pt-1 text-xs text-muted-foreground/60">
                  <Users className="size-3" />
                  {formatNumber(tier.memberCount)} members
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
