import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(dashboard)/dashboard/studio')({
  component: StudioPage,
})

function StudioPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Studio</h1>
        <p className="mt-1 text-sm text-white/50">
          Create and manage your content
        </p>
      </div>

      {/* Empty state card */}
      <div className="flex items-center justify-center rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-16">
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/10">
            <svg
              className="h-6 w-6 text-white/40"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
              />
            </svg>
          </div>
          <h3 className="text-sm font-medium text-white/80">
            No projects yet
          </h3>
          <p className="mt-1 text-xs text-white/40">
            Get started by creating your first studio project.
          </p>
        </div>
      </div>
    </div>
  )
}
