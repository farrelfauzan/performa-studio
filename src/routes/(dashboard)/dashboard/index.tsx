import { createFileRoute } from '@tanstack/react-router'
import { StatsSection } from '@/components/dashboard/stats-section'
import { MostWatchedSection } from '@/components/dashboard/most-watched-section'
import { RecentActivitySection } from '@/components/dashboard/recent-activity-section'
import { DraftsSection } from '@/components/dashboard/drafts-section'

export const Route = createFileRoute('/(dashboard)/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Welcome back! Here&apos;s an overview of your workspace.
        </p>
      </div>

      <StatsSection />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <MostWatchedSection />
        <RecentActivitySection />
      </div>

      <DraftsSection />
    </div>
  )
}
