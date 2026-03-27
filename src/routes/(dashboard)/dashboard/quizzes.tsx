import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { Plus, MoreHorizontal, Eye, EyeOff, Trash2, BarChart3 } from 'lucide-react'
import { toast } from 'sonner'
import { useQuizzes, useDeleteQuiz, usePublishQuiz, useUnpublishQuiz } from '@/hooks/use-quizzes'
import { PerformaTable, type Column } from '@/components/performa-table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Quiz } from '@/lib/types'

const STATUS_STYLES = {
  published: 'bg-green-500/15 text-green-400 border-transparent',
  draft: 'bg-yellow-500/15 text-yellow-400 border-transparent',
} as const

export const Route = createFileRoute('/(dashboard)/dashboard/quizzes')({
  component: QuizzesPage,
  validateSearch: (search: Record<string, unknown>) => ({
    page: Number(search.page) || 0,
    q: typeof search.q === 'string' ? search.q : '',
  }),
})

function QuizzesPage() {
  const { page, q } = Route.useSearch()
  const navigate = useNavigate()
  const routeNavigate = Route.useNavigate()

  const { data, isLoading } = useQuizzes({
    page,
    pageSize: 10,
    search: q || undefined,
  })

  const {mutateAsync: deleteQuiz} = useDeleteQuiz()
  const {mutateAsync: publishQuiz} = usePublishQuiz()
  const {mutateAsync: unpublishQuiz} = useUnpublishQuiz()

  const setPage = (p: number) =>
    routeNavigate({ search: (prev) => ({ ...prev, page: p }), replace: true })

  const setSearch = (search: string) =>
    routeNavigate({
      search: (prev) => ({ ...prev, q: search, page: 0 }),
      replace: true,
    })

  const openDetail = (quiz: Quiz) => {
    navigate({
      to: '/dashboard/quizzes/$quizId',
      params: { quizId: quiz.id },
      search: { tab: 'edit' },
    })
  }

  const handleDelete = async (id: string) => {
    await deleteQuiz(id)
    toast.success('Quiz deleted')
  }

  const handlePublish = async (id: string) => {
    await publishQuiz(id)
    toast.success('Quiz published')
  }

  const handleUnpublish = async (id: string) => {
    await unpublishQuiz(id)
    toast.success('Quiz unpublished')
  }

  const columns: Column<Quiz>[] = [
    {
      key: 'title',
      header: 'Quiz',
      render: (quiz) => (
        <div>
          <span className="text-sm font-medium text-white/90">
            {quiz.title}
          </span>
          {quiz.description && (
            <p className="mt-0.5 text-xs text-white/40 truncate max-w-xs">
              {quiz.description}
            </p>
          )}
        </div>
      ),
    },
    {
      key: 'questionCount',
      header: 'Questions',
      render: (quiz) => (
        <span className="text-sm text-white/60">{quiz.questionCount}</span>
      ),
    },
    {
      key: 'isPublished',
      header: 'Status',
      render: (quiz) => {
        const label = quiz.isPublished ? 'published' : 'draft'
        return (
          <Badge className={`text-[12px] capitalize py-3 ${STATUS_STYLES[label]}`}>
            {label}
          </Badge>
        )
      },
    },
    {
      key: 'passingScore',
      header: 'Passing Score',
      render: (quiz) => (
        <span className="text-sm text-white/60">{quiz.passingScore}%</span>
      ),
    },
    {
      key: 'updatedAt',
      header: 'Updated',
      render: (quiz) => (
        <span className="text-sm text-white/40">
          {new Date(quiz.updatedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (quiz) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {quiz.isPublished ? (
              <DropdownMenuItem onClick={() => handleUnpublish(quiz.id)}>
                <EyeOff className="mr-2 h-4 w-4" />
                Unpublish
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handlePublish(quiz.id)}>
                <Eye className="mr-2 h-4 w-4" />
                Publish
              </DropdownMenuItem>
            )}
            <DropdownMenuItem
              onClick={() =>
                navigate({
                  to: '/dashboard/quizzes/$quizId',
                  params: { quizId: quiz.id },
                  search: { tab: 'analytics' },
                })
              }
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              Analytics
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-400"
              onClick={() => handleDelete(quiz.id)}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Quizzes</h1>
          <p className="mt-1 text-sm text-white/50">
            Create and manage your quizzes
          </p>
        </div>
        <Button asChild>
          <Link to="/dashboard/quizzes/create">
            <Plus className="h-3.5 w-3.5" />
            Create Quiz
          </Link>
        </Button>
      </div>

      <PerformaTable
        data={data?.quizzes ?? []}
        columns={columns}
        isLoading={isLoading}
        pageSize={10}
        searchPlaceholder="Search quizzes..."
        getSearchValue={(q) => q.title}
        onRowClick={openDetail}
        page={page}
        onPageChange={setPage}
        search={q}
        onSearchChange={setSearch}
        totalItems={data?.meta?.itemCount}
      />
    </div>
  )
}
