import { createFileRoute, Link } from '@tanstack/react-router'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { useStudioProjects } from '@/hooks/use-studio'
import { PerformaTable, type Column } from '@/components/performa-table'
import { PerformaGrid } from '@/components/performa-grid'
import type { StudioProject } from '@/lib/dummy-data'

type ViewMode = 'grid' | 'list'

const STATUS_STYLES: Record<StudioProject['status'], string> = {
  draft: 'bg-yellow-500/15 text-yellow-400',
  'in-progress': 'bg-blue-500/15 text-blue-400',
  published: 'bg-green-500/15 text-green-400',
}

const studioColumns: Column<StudioProject>[] = [
  {
    key: 'title',
    header: 'Project',
    render: (p) => (
      <div className="flex items-center gap-3">
        <img
          src={p.thumbnail}
          alt={p.title}
          className="h-8 w-8 shrink-0 rounded object-cover"
        />
        <span className="text-sm font-medium text-white/90">{p.title}</span>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (p) => (
      <span
        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[p.status]}`}
      >
        {p.status}
      </span>
    ),
  },
  {
    key: 'duration',
    header: 'Duration',
    render: (p) => <span className="text-sm text-white/60">{p.duration}</span>,
  },
  {
    key: 'updatedAt',
    header: 'Updated',
    render: (p) => <span className="text-sm text-white/40">{p.updatedAt}</span>,
  },
]

export const Route = createFileRoute('/(dashboard)/dashboard/studio')({
  component: StudioPage,
  validateSearch: (search: Record<string, unknown>) => ({
    view: (search.view === 'list' ? 'list' : 'grid') as ViewMode,
  }),
})

function StudioPage() {
  const { data: projects, isLoading } = useStudioProjects()
  const { view } = Route.useSearch()
  const navigate = Route.useNavigate()

  const setView = (v: ViewMode) => {
    navigate({
      search: { view: v },
      replace: true,
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Studio</h1>
          <p className="mt-1 text-sm text-white/50">
            Create and manage your content
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/dashboard/studio/create"
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-blue-500"
          >
            <Plus className="h-3.5 w-3.5" />
            Create
          </Link>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-white/12 bg-white/5 p-1">
            <button
              onClick={() => setView('grid')}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                view === 'grid'
                  ? 'bg-white/12 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`flex items-center justify-center rounded-md p-1.5 transition-colors ${
                view === 'list'
                  ? 'bg-white/12 text-white'
                  : 'text-white/40 hover:text-white/70'
              }`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Projects */}
      {view === 'grid' ? (
        <PerformaGrid
          data={projects?.projects ?? []}
          isLoading={isLoading}
          pageSize={9}
          searchPlaceholder="Search projects..."
          getSearchValue={(p) => p.title}
          renderItem={(project) => (
            <div className="group rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-5 transition-colors hover:bg-white/8 cursor-pointer">
              <div className="h-28 rounded-xl bg-white/5 mb-4 overflow-hidden">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-white/90 truncate group-hover:text-white">
                    {project.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-white/30">
                    {project.updatedAt} &middot; {project.duration}
                  </p>
                </div>
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[project.status]}`}
                >
                  {project.status}
                </span>
              </div>
            </div>
          )}
        />
      ) : (
        <PerformaTable
          data={projects?.projects ?? []}
          columns={studioColumns}
          isLoading={isLoading}
          pageSize={10}
          searchPlaceholder="Search projects..."
          getSearchValue={(p) => p.title}
        />
      )}
    </div>
  )
}
