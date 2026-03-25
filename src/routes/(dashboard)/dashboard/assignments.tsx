import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useTeacherAssignments } from '@/hooks/use-assignments'
import { PerformaTable, type Column } from '@/components/performa-table'
import { Badge } from '@/components/ui/badge'
import type { Assignment } from '@/lib/types'

const ASSIGNMENT_STATUS_STYLES: Record<string, string> = {
  ASSIGNED: 'bg-blue-500/15 text-blue-400 border-transparent',
  IN_PROGRESS: 'bg-yellow-500/15 text-yellow-400 border-transparent',
  COMPLETED: 'bg-green-500/15 text-green-400 border-transparent',
  OVERDUE: 'bg-red-500/15 text-red-400 border-transparent',
}

const assignmentColumns: Column<Assignment>[] = [
  {
    key: 'student',
    header: 'Student',
    render: (a) => (
      <div className="text-sm">
        <span className="font-medium text-white/90">
          {a.student?.fullName ?? '—'}
        </span>
        {a.student?.uniqueId && (
          <span className="ml-2 font-mono text-white/40">
            {a.student.uniqueId}
          </span>
        )}
      </div>
    ),
  },
  {
    key: 'content',
    header: 'Content',
    render: (a) => (
      <span className="text-sm text-white/80">
        {a.content?.title ?? a.contentId}
      </span>
    ),
  },
  {
    key: 'status',
    header: 'Status',
    render: (a) => (
      <Badge
        className={`text-[12px] py-3 ${ASSIGNMENT_STATUS_STYLES[a.status] ?? ''}`}
      >
        {String(a.status ?? '').replace('_', ' ') || 'unknown'}
      </Badge>
    ),
  },
  {
    key: 'progress',
    header: 'Progress',
    render: (a) => (
      <div className="flex items-center gap-2">
        <div className="h-2 w-20 rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-blue-500 transition-all"
            style={{ width: `${a.progress}%` }}
          />
        </div>
        <span className="text-xs text-white/50">{a.progress}%</span>
      </div>
    ),
  },
  {
    key: 'dueDate',
    header: 'Due Date',
    render: (a) => (
      <span className="text-sm text-white/40">
        {a.dueDate ? new Date(a.dueDate).toLocaleDateString() : '—'}
      </span>
    ),
  },
  {
    key: 'assignedAt',
    header: 'Assigned',
    render: (a) => (
      <span className="text-sm text-white/40">
        {new Date(a.assignedAt).toLocaleDateString()}
      </span>
    ),
  },
]

export const Route = createFileRoute('/(dashboard)/dashboard/assignments')({
  component: AssignmentsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 0,
    q: typeof search.q === 'string' ? search.q : '',
  }),
})

function AssignmentsPage() {
  const { page, q } = Route.useSearch()
  const { data, isLoading } = useTeacherAssignments({
    page,
    pageSize: 12,
    search: q || undefined,
  })
  const navigate = useNavigate()

  const setPage = (p: number) => {
    navigate({
      to: '/dashboard/assignments',
      search: { page: p, q },
      replace: true,
    })
  }

  const setSearch = (search: string) => {
    navigate({
      to: '/dashboard/assignments',
      search: { q: search, page: 0 },
      replace: true,
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Assignments</h1>
        <p className="mt-1 text-sm text-white/50">
          Overview of all content assignments to students
        </p>
      </div>

      <PerformaTable
        data={data?.assignments ?? []}
        columns={assignmentColumns}
        isLoading={isLoading}
        pageSize={12}
        searchPlaceholder="Search assignments..."
        getSearchValue={(a) =>
          `${a.student?.fullName ?? ''} ${a.content?.title ?? ''}`
        }
        onRowClick={(assignment) =>
          navigate({
            to: '/dashboard/students/$studentId',
            params: { studentId: assignment.studentId },
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
