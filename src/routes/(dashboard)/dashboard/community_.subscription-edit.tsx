import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import {
  SubscriptionTierForm,
  type TierFormData,
} from '@/components/community/subscription-tier-form'
import {
  fetchSubscriptionTiers,
  updateSubscriptionTiers,
} from '@/lib/community-data'
import { useApiQuery } from '@/hooks/use-api'

export const Route = createFileRoute(
  '/(dashboard)/dashboard/community_/subscription-edit',
)({
  component: SubscriptionEditPage,
})

function SubscriptionEditPage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { data, isLoading } = useApiQuery(
    'community-subscriptions',
    fetchSubscriptionTiers,
  )

  async function handleSubmit(tiers: TierFormData[]) {
    setIsSubmitting(true)
    try {
      await updateSubscriptionTiers(
        tiers.map((t, i) => ({
          id: t.id ?? i + 1,
          name: t.name,
          price: Number(t.price),
          description: t.description,
          features: {
            adFree: t.adFree,
            badge: t.badge,
            earlyAccess: t.earlyAccess,
            directMessage: t.directMessage,
          },
          memberCount: data?.[i]?.memberCount ?? 0,
          approvalStatus: 'pending' as const,
        })),
      )
      toast.success('Changes submitted for approval!')
      navigate({ to: '/dashboard/community' })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="size-8 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="h-96 w-full rounded-xl" />
      </div>
    )
  }

  const initialTiers: TierFormData[] = data.map((tier) => ({
    id: tier.id,
    name: tier.name,
    price: String(tier.price),
    description: tier.description,
    adFree: tier.features.adFree,
    badge: tier.features.badge,
    earlyAccess: tier.features.earlyAccess,
    directMessage: tier.features.directMessage,
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => navigate({ to: '/dashboard/community' })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">
            Edit Subscription Tiers
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Update your membership tiers  changes require admin approval
          </p>
        </div>
      </div>

      <SubscriptionTierForm
        mode="edit"
        initialTiers={initialTiers}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}