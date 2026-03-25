import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { useStudents } from '@/hooks/use-students'
import { PerformaTable, type Column } from '@/components/performa-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CreateStudentDialog } from '@/components/students/create-student-sheet'
import type { Student } from '@/lib/types'

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-400 border-transparent',
  INACTIVE: 'bg-gray-500/15 text-gray-400 border-transparent',
}

const studentColumns: Column<Student>[] = [
  {
    key: 'uniqueId',
    header: 'ID',
    render: (s) => (
      <span className="text-sm font-mono text-white/60">{s.uniqueId}</span>
    ),
  },
  {
    key: 'fullName',
    header: 'Name',
    render: (s) => (
      <span className="text-sm font-medium text-white/90">{s.fullName}</span>
    ),
  },
  {
    key: 'active',
    header: 'Status',
    render: (s) => (
      <Badge
        className={`text-[12px] capitalize py-3 ${STATUS_STYLES[s.active] ?? STATUS_STYLES.INACTIVE}`}
      >
        {s.active.toLowerCase()}
      </Badge>
    ),
  },
  {
    key: 'createdAt',
    header: 'Created',
    render: (s) => (
      <span className="text-sm text-white/40">
        {new Date(s.createdAt).toLocaleDateString()}
      </span>
    ),
  },
]

export const Route = createFileRoute('/(dashboard)/dashboard/students/')({
  component: StudentsPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 0,
    q: typeof search.q === 'string' ? search.q : '',
  }),
})

function StudentsPage() {
  const { page, q } = Route.useSearch()
  const { data, isLoading } = useStudents({
    page,
    pageSize: 12,
    search: q || undefined,
  })
  const navigate = useNavigate()
  const routeNavigate = Route.useNavigate()
  const [createOpen, setCreateOpen] = useState(false)

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
          <h1 className="text-2xl font-bold text-white">Students</h1>
          <p className="mt-1 text-sm text-white/50">
            Manage your registered students
          </p>
        </div>
        <Button
          onClick={() => setCreateOpen(true)}
        >
          <Plus className="h-3.5 w-3.5" />
          Add Student
        </Button>
      </div>

      <PerformaTable
        data={data?.students ?? []}
        columns={studentColumns}
        isLoading={isLoading}
        pageSize={12}
        searchPlaceholder="Search students..."
        getSearchValue={(s) => `${s.fullName} ${s.uniqueId}`}
        onRowClick={(student) =>
          navigate({
            to: '/dashboard/students/$studentId',
            params: { studentId: student.id },
          })
        }
        page={page}
        onPageChange={setPage}
        search={q}
        onSearchChange={setSearch}
        totalItems={data?.meta?.itemCount}
      />

      <CreateStudentDialog open={createOpen} onOpenChange={setCreateOpen} />
    </div>
  )
}
