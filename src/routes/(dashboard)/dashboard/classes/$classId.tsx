import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Trash2, Plus, UserMinus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  useClass,
  useDeleteClass,
  useClassTeachers,
  useClassStudents,
  useRemoveTeacher,
  useRemoveStudent,
} from '@/hooks/use-classes'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { PerformaTable, type Column } from '@/components/performa-table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { AddTeachersToClassSheet } from '@/components/classes/add-teachers-to-class-sheet'
import { AddStudentsToClassSheet } from '@/components/classes/add-students-to-class-sheet'
import type { ClassTeacherItem, ClassStudentItem } from '@/lib/types'

export const Route = createFileRoute(
  '/(dashboard)/dashboard/classes/$classId',
)({
  component: ClassDetailPage,
})

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-400 border-transparent',
  INACTIVE: 'bg-gray-500/15 text-gray-400 border-transparent',
}

function ClassDetailPage() {
  const { classId } = Route.useParams()
  const navigate = useNavigate()

  const { data: classData, isLoading } = useClass(classId)
  const { mutate: deleteClass } = useDeleteClass()

  const [addTeachersOpen, setAddTeachersOpen] = useState(false)
  const [addStudentsOpen, setAddStudentsOpen] = useState(false)

  const cls = classData?.data ?? null

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!cls) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-white/60">Class not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() =>
            navigate({ to: '/dashboard/classes', search: { page: 0, q: '' } })
          }
        >
          Back to Classes
        </Button>
      </div>
    )
  }

  const handleDeleteClass = () => {
    deleteClass(cls.id, {
      onSuccess: () =>
        navigate({ to: '/dashboard/classes', search: { page: 0, q: '' } }),
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() =>
              navigate({
                to: '/dashboard/classes',
                search: { page: 0, q: '' },
              })
            }
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-white">{cls.name}</h1>
            <p className="text-sm text-white/50">{cls.uniqueId}</p>
          </div>
          <Badge
            className={`ml-2 text-[12px] capitalize py-3 ${STATUS_STYLES[cls.active] ?? STATUS_STYLES.INACTIVE}`}
          >
            {cls.active.toLowerCase()}
          </Badge>
        </div>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="h-3.5 w-3.5" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete class?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {cls.name} and remove all teacher
                and student associations. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteClass}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Info card */}
      <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm text-white/40">Description</p>
              <p className="mt-1 text-sm text-white/80">
                {cls.description || 'No description'}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/40">Teachers</p>
              <p className="mt-1 text-sm font-medium text-white/90">
                {cls.teacherCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/40">Students</p>
              <p className="mt-1 text-sm font-medium text-white/90">
                {cls.studentCount}
              </p>
            </div>
            <div>
              <p className="text-sm text-white/40">Created</p>
              <p className="mt-1 text-sm text-white/80">
                {new Date(cls.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs: Teachers / Students */}
      <Tabs defaultValue="teachers">
        <TabsList>
          <TabsTrigger value="teachers">Teachers</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
        </TabsList>

        <TabsContent value="teachers" className="mt-4">
          <TeachersTab
            classId={classId}
            onAddClick={() => setAddTeachersOpen(true)}
          />
        </TabsContent>

        <TabsContent value="students" className="mt-4">
          <StudentsTab
            classId={classId}
            onAddClick={() => setAddStudentsOpen(true)}
          />
        </TabsContent>
      </Tabs>

      <AddTeachersToClassSheet
        classId={classId}
        open={addTeachersOpen}
        onOpenChange={setAddTeachersOpen}
      />
      <AddStudentsToClassSheet
        classId={classId}
        open={addStudentsOpen}
        onOpenChange={setAddStudentsOpen}
      />
    </div>
  )
}

function TeachersTab({
  classId,
  onAddClick,
}: {
  classId: string
  onAddClick: () => void
}) {
  const { data, isLoading } = useClassTeachers(classId)
  const { mutate: removeTeacher } = useRemoveTeacher()

  const columns: Column<ClassTeacherItem>[] = [
    {
      key: 'fullName',
      header: 'Name',
      render: (t) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={t.profilePictureUrl ?? undefined} />
            <AvatarFallback className="bg-white/10 text-xs text-white/60">
              {t.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-white/90">
            {t.fullName}
          </span>
        </div>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (t) => (
        <span className="text-sm text-white/40">
          {new Date(t.joinedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (t) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <UserMinus className="h-3.5 w-3.5 text-red-400" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove teacher?</AlertDialogTitle>
              <AlertDialogDescription>
                Remove {t.fullName} from this class?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  removeTeacher({ classId, customerId: t.customerId })
                }
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ]

  return (
    <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Teachers</CardTitle>
        <Button size="sm" onClick={onAddClick}>
          <Plus className="h-3.5 w-3.5" />
          Add Teacher
        </Button>
      </CardHeader>
      <CardContent>
        <PerformaTable
          data={data?.teachers ?? []}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          searchPlaceholder="Search teachers..."
          getSearchValue={(t) => t.fullName}
        />
      </CardContent>
    </Card>
  )
}

function StudentsTab({
  classId,
  onAddClick,
}: {
  classId: string
  onAddClick: () => void
}) {
  const { data, isLoading } = useClassStudents(classId)
  const { mutate: removeStudent } = useRemoveStudent()

  const columns: Column<ClassStudentItem>[] = [
    {
      key: 'fullName',
      header: 'Name',
      render: (s) => (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={s.profilePictureUrl ?? undefined} />
            <AvatarFallback className="bg-white/10 text-xs text-white/60">
              {s.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="text-sm font-medium text-white/90">
            {s.fullName}
          </span>
        </div>
      ),
    },
    {
      key: 'joinedAt',
      header: 'Joined',
      render: (s) => (
        <span className="text-sm text-white/40">
          {new Date(s.joinedAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (s) => (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <UserMinus className="h-3.5 w-3.5 text-red-400" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove student?</AlertDialogTitle>
              <AlertDialogDescription>
                Remove {s.fullName} from this class?
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() =>
                  removeStudent({ classId, studentId: s.studentId })
                }
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ),
    },
  ]

  return (
    <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-white">Students</CardTitle>
        <Button size="sm" onClick={onAddClick}>
          <Plus className="h-3.5 w-3.5" />
          Add Student
        </Button>
      </CardHeader>
      <CardContent>
        <PerformaTable
          data={data?.students ?? []}
          columns={columns}
          isLoading={isLoading}
          pageSize={10}
          searchPlaceholder="Search students..."
          getSearchValue={(s) => s.fullName}
        />
      </CardContent>
    </Card>
  )
}
