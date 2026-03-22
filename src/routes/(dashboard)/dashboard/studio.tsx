import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { LayoutGrid, List, Plus } from 'lucide-react'
import { useStudioProjects, getContentStatusLabel } from '@/hooks/use-studio'
import { PerformaTable, type Column } from '@/components/performa-table'
import { PerformaGrid } from '@/components/performa-grid'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Content } from '@/lib/types'

type ViewMode = 'grid' | 'list'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-500/15 text-yellow-400 border-transparent',
  published: 'bg-green-500/15 text-green-400 border-transparent',
  archived: 'bg-gray-500/15 text-gray-400 border-transparent',
}

const studioColumns: Column<Content>[] = [
  {
    key: 'title',
    header: 'Project',
    render: (p) => (
      <div className="flex items-center gap-3">
        {p.thumbnailUrl ? (
          <img
            src={p.thumbnailUrl}
            alt={p.title}
            className="h-8 w-8 shrink-0 rounded object-cover"
          />
        ) : (
          <div className="h-8 w-8 shrink-0 rounded bg-white/10" />
        )}
        <span className="text-sm font-medium text-white/90">{p.title}</span>
      </div>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (p) => {
      const label = getContentStatusLabel(p.status)
      return (
        <Badge
          className={`text-[12px] capitalize py-3 ${STATUS_STYLES[label] ?? STATUS_STYLES.draft}`}
        >
          {label}
        </Badge>
      )
    },
  },
  {
    key: 'year',
    header: 'Year',
    render: (p) => (
      <span className="text-sm text-white/60">{p.year ?? '—'}</span>
    ),
  },
  {
    key: 'updatedAt',
    header: 'Updated',
    render: (p) => (
      <span className="text-sm text-white/40">
        {new Date(p.updatedAt).toLocaleDateString()}
      </span>
    ),
  },
]

export const Route = createFileRoute('/(dashboard)/dashboard/studio')({
  component: StudioPage,
  validateSearch: (search: Record<string, unknown>) => ({
    view: (search.view === 'list' ? 'list' : 'grid') as ViewMode,
    page: Number(search.page) || 0,
    q: typeof search.q === 'string' ? search.q : '',
  }),
})

function StudioPage() {
  const { view, page, q } = Route.useSearch()
  const { data, isLoading } = useStudioProjects({
    page,
    pageSize: view === 'grid' ? 9 : 10,
    search: q || undefined,
  })
  const navigate = useNavigate()
  const routeNavigate = Route.useNavigate()

  const setView = (v: ViewMode) => {
    routeNavigate({
      search: (prev) => ({ ...prev, view: v }),
      replace: true,
    })
  }

  const setPage = (p: number) => {
    routeNavigate({
      search: (prev) => ({ ...prev, page: p }),
      replace: true,
    })
  }

  const setSearch = (search: string) => {
    routeNavigate({
      search: (prev) => ({ ...prev, q: search, page: 0 }),
      replace: true,
    })
  }

  const openDetail = (project: Content) => {
    navigate({
      to: '/dashboard/studio/$contentId',
      params: { contentId: project.id },
      search: { view, page, q },
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
          <Button asChild>
            <Link to="/dashboard/studio/create">
              <Plus className="h-3.5 w-3.5" />
              Create
            </Link>
          </Button>

          {/* View toggle */}
          <div className="flex items-center gap-1 rounded-lg border border-white/12 bg-white/5 p-1">
            <Button
              variant={view === 'grid' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setView('grid')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === 'list' ? 'secondary' : 'ghost'}
              size="icon-sm"
              onClick={() => setView('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects */}
      {view === 'grid' ? (
        <PerformaGrid
          data={data?.projects ?? []}
          isLoading={isLoading}
          pageSize={9}
          searchPlaceholder="Search projects..."
          getSearchValue={(p) => p.title}
          onItemClick={openDetail}
          page={page}
          skeletonCount={9}
          onPageChange={setPage}
          search={q}
          onSearchChange={setSearch}
          totalItems={data?.meta?.itemCount}
          renderItem={(project) => {
            const statusLabel = getContentStatusLabel(project.status)
            return (
              <div className="group rounded-2xl border border-white/12 bg-white/5 backdrop-blur-xl p-5 transition-colors hover:bg-white/8 cursor-pointer">
                <div className="aspect-video rounded-xl bg-white/5 mb-4 overflow-hidden">
                  {project.thumbnailUrl ? (
                    <img
                      src={project.thumbnailUrl}
                      alt={project.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="h-full w-full bg-white/5" />
                  )}
                </div>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="text-sm font-medium text-white/90 truncate group-hover:text-white">
                      {project.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-white/30">
                      {new Date(project.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Badge
                    className={`shrink-0 text-[12px] capitalize py-3 ${STATUS_STYLES[statusLabel] ?? STATUS_STYLES.draft}`}
                  >
                    {statusLabel}
                  </Badge>
                </div>
              </div>
            )
          }}
        />
      ) : (
        <PerformaTable
          data={data?.projects ?? []}
          columns={studioColumns}
          isLoading={isLoading}
          pageSize={10}
          searchPlaceholder="Search projects..."
          getSearchValue={(p) => p.title}
          onRowClick={openDetail}
          page={page}
          onPageChange={setPage}
          search={q}
          onSearchChange={setSearch}
          totalItems={data?.meta?.itemCount}
        />
      )}
    </div>
  )
}
