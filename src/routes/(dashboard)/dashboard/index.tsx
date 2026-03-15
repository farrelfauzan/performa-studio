import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/dashboard/')({
  component: DashboardPage,
})

function DashboardPage() {
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
        {[
          { label: 'Total Projects', value: '0' },
          { label: 'Active Sessions', value: '0' },
          { label: 'Storage Used', value: '0 MB' },
        ].map((stat) => (
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
        <div className="flex items-center justify-center py-8">
          <p className="text-sm text-white/30">No recent activity</p>
        </div>
      </div>
    </div>
  )
}
