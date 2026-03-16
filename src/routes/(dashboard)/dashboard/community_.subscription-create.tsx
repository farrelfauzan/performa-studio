import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  SubscriptionTierForm,
  type TierFormData,
} from '@/components/community/subscription-tier-form'
import { submitSubscriptionTiers } from '@/lib/community-data'

export const Route = createFileRoute(
  '/(dashboard)/dashboard/community_/subscription-create',
)({
  component: SubscriptionCreatePage,
})

function SubscriptionCreatePage() {
  const navigate = useNavigate()
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(tiers: TierFormData[]) {
    setIsSubmitting(true)
    try {
      await submitSubscriptionTiers(
        tiers.map((t) => ({
          name: t.name,
          price: Number(t.price),
          description: t.description,
          features: {
            adFree: t.adFree,
            badge: t.badge,
            earlyAccess: t.earlyAccess,
            directMessage: t.directMessage,
          },
        })),
      )
      toast.success('Subscription tiers submitted for approval!')
      navigate({ to: '/dashboard/community' })
    } finally {
      setIsSubmitting(false)
    }
  }

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
            Create Subscription Tiers
          </h1>
          <p className="mt-0.5 text-sm text-muted-foreground">
            Define up to 3 membership tiers for your community
          </p>
        </div>
      </div>

      <SubscriptionTierForm
        mode="create"
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}
