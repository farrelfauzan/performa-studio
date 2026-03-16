import { createFileRoute } from '@tanstack/react-router'
import { CommunityStatsSection } from '@/components/community/community-stats-section'
import { CommentsSection } from '@/components/community/comments-section'
import { SubscriptionSection } from '@/components/community/subscription-section'

export const Route = createFileRoute('/(dashboard)/dashboard/community')({
  component: CommunityPage,
})

function CommunityPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Community</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Engage with your audience, manage comments, and grow your membership.
        </p>
      </div>

      <CommunityStatsSection />
      <SubscriptionSection />
      <CommentsSection />
    </div>
  )
}
