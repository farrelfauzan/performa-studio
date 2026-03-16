import { createFileRoute } from '@tanstack/react-router'
import { useDashboardData } from '@/hooks/use-dashboard'

export const Route = createFileRoute('/(dashboard)/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
  const { data, isLoading } = useDashboardData()

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-white/50">
          Welcome back! Here&apos;s an overview of your workspace.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading || !data
          ? Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-white/12 bg-white/5 p-6"
              >
                <div className="h-3 w-24 rounded bg-white/10" />
                <div className="mt-4 h-8 w-16 rounded bg-white/10" />
              </div>
            ))
          : data.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-6"
              >
                <p className="text-xs font-medium text-white/40 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="mt-2 text-3xl font-semibold text-white">
                  {stat.value}
                </p>
              </div>
            ))}
      </div>

      {/* Recent activity card */}
      <div className="rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-6">
        <h2 className="text-sm font-medium text-white/80 mb-4">
          Recent Activity
        </h2>
        {isLoading || !data ? (
          <div className="animate-pulse space-y-0">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3 py-3">
                <div className="h-8 w-8 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-48 rounded bg-white/10" />
                  <div className="h-2 w-24 rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="divide-y divide-white/8">
            {data.activity.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-500/15 text-blue-400">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                    />
                  </svg>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-white/80 truncate">
                    {item.action} &mdash;{' '}
                    <span className="text-white/60">{item.target}</span>
                  </p>
                  <p className="text-xs text-white/30">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
