import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useClasses } from '@/hooks/use-classes'
import { PerformaTable, type Column } from '@/components/performa-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { Class } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-400 border-transparent',
  INACTIVE: 'bg-gray-500/15 text-gray-400 border-transparent',
}

const classColumns: Column<Class>[] = [
  {
    key: 'name',
    header: 'Name',
    render: (c) => (
      <span className="text-sm font-medium text-white/90">{c.name}</span>
    ),
  },
  {
    key: 'teacherCount',
    header: 'Teachers',
    render: (c) => (
      <span className="text-sm text-white/60">{c.teacherCount}</span>
    ),
  },
  {
    key: 'studentCount',
    header: 'Students',
    render: (c) => (
      <span className="text-sm text-white/60">{c.studentCount}</span>
    ),
  },
  {
    key: 'active',
    header: 'Status',
    render: (c) => (
      <Badge
        className={`text-[12px] capitalize py-3 ${STATUS_STYLES[c.active] ?? STATUS_STYLES.INACTIVE}`}
      >
        {c.active.toLowerCase()}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (c) => (
      <span className="text-sm text-white/40">
        {new Date(c.createdAt).toLocaleDateString()}
      </span>
    ),
  },
]

export const Route = createFileRoute('/(dashboard)/dashboard/classes/')({
  component: ClassesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 0,
    q: typeof search.q === 'string' ? search.q : '',
  }),
})

function ClassesPage() {
  const { page, q } = Route.useSearch()
  const { data, isLoading } = useClasses({
    page,
    pageSize: 12,
    search: q || undefined,
  })
  const navigate = useNavigate()
  const routeNavigate = Route.useNavigate()

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Classes</h1>
          <p className="mt-1 text-sm text-white/50">
            Manage your classes and memberships
          </p>
        </div>
        <Button
          onClick={() =>
            navigate({ to: '/dashboard/classes/create' })
          }
        >
          <Plus className="h-3.5 w-3.5" />
          Create Class
        </Button>
      </div>

      <PerformaTable
        data={data?.classes ?? []}
        columns={classColumns}
        isLoading={isLoading}
        pageSize={12}
        searchPlaceholder="Search classes..."
        getSearchValue={(c) => `${c.name} ${c.uniqueId}`}
        onRowClick={(cls) =>
          navigate({
            to: '/dashboard/classes/$classId',
            params: { classId: cls.id },
          })
        }
        page={page}
        onPageChange={setPage}
        search={q}
        onSearchChange={setSearch}
        totalItems={data?.meta?.itemCount}
      />
    </div>
  )
}
