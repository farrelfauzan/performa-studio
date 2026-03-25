import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Calendar,
  Phone,
  User,
  Trash2,
  ClipboardList,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useStudent, useDeleteStudent } from '@/hooks/use-students'
import {
  useStudentAssignments,
  useDeleteAssignment,
} from '@/hooks/use-assignments'
import { AssignContentSheet } from '@/components/students/assign-content-sheet'
import { ProgressDetailDialog } from '@/components/students/progress-detail-dialog'
import type { Assignment } from '@/lib/types'
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

export const Route = createFileRoute(
  '/(dashboard)/dashboard/students/$studentId',
)({
  component: StudentDetailPage,
})

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-400 border-transparent',
  INACTIVE: 'bg-gray-500/15 text-gray-400 border-transparent',
}

const ASSIGNMENT_STATUS_STYLES: Record<string, string> = {
  ASSIGNED: 'bg-blue-500/15 text-blue-400 border-transparent',
  IN_PROGRESS: 'bg-yellow-500/15 text-yellow-400 border-transparent',
  COMPLETED: 'bg-green-500/15 text-green-400 border-transparent',
  OVERDUE: 'bg-red-500/15 text-red-400 border-transparent',
}

function StudentDetailPage() {
  const { studentId } = Route.useParams()
  const navigate = useNavigate()

  const { data: studentData, isLoading: studentLoading } =
    useStudent(studentId)
  const { data: assignmentsData, isLoading: assignmentsLoading } =
    useStudentAssignments(studentId)
  const { mutate: deleteStudent } = useDeleteStudent()
  const { mutate: deleteAssignment } = useDeleteAssignment()

  const [activeTab, setActiveTab] = useState<'profile' | 'assignments'>(
    'profile',
  )
  const [assignSheetOpen, setAssignSheetOpen] = useState(false)
  const [progressDialog, setProgressDialog] = useState<{
    studentId: string
    contentId: string
  } | null>(null)

  const student = studentData?.data ?? null

  if (studentLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!student) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-white/60">Student not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => navigate({ to: '/dashboard/students', search: { page: 0, q: '' } })}
        >
          Back to Students
        </Button>
      </div>
    )
  }

  const handleDeleteStudent = () => {
    deleteStudent(student.id, {
      onSuccess: () => navigate({ to: '/dashboard/students', search: { page: 0, q: '' } }),
    })
  }

  const handleRemoveAssignment = (assignment: Assignment) => {
    deleteAssignment({
      studentId: assignment.studentId,
      contentId: assignment.contentId,
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() => navigate({ to: '/dashboard/students', search: { page: 0, q: '' } })}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-2xl font-bold text-white">
              {student.fullName}
            </h1>
            <span className="text-sm font-mono text-white/40">
              ({student.uniqueId})
            </span>
            <Badge
              className={`shrink-0 text-[12px] capitalize py-3 ${STATUS_STYLES[student.active] ?? STATUS_STYLES.INACTIVE}`}
            >
              {student.active.toLowerCase()}
            </Badge>
          </div>
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
              <AlertDialogTitle>Delete student?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {student.fullName} and all their
                data. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDeleteStudent}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>

      {/* Tab bar */}
      <div className="flex items-center gap-4 border-b border-white/10">
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === 'profile'
              ? 'border-b-2 border-white text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Profile
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('assignments')}
          className={`pb-2 text-sm font-medium transition-colors ${
            activeTab === 'assignments'
              ? 'border-b-2 border-white text-white'
              : 'text-white/40 hover:text-white/60'
          }`}
        >
          Assignments
        </button>
      </div>

      {/* Profile Tab */}
      {activeTab === 'profile' && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
            <CardContent className="space-y-4 pt-6">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  {student.profilePictureUrl && (
                    <AvatarImage src={student.profilePictureUrl} alt={student.fullName} />
                  )}
                  <AvatarFallback className="bg-white/10">
                    <User className="h-8 w-8 text-white/50" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h2 className="text-lg font-semibold text-white">
                    {student.fullName}
                  </h2>
                  <p className="text-sm text-white/50">{student.uniqueId}</p>
                </div>
              </div>

              {student.phoneNumber && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Phone className="h-4 w-4" />
                  <span>{student.phoneNumber}</span>
                </div>
              )}

              {student.dateOfBirth && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {new Date(student.dateOfBirth).toLocaleDateString()}
                  </span>
                </div>
              )}

              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar className="h-4 w-4" />
                <span>
                  Joined {new Date(student.createdAt).toLocaleDateString()}
                </span>
              </div>

              {student.bio && (
                <p className="text-sm text-white/50">{student.bio}</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Assignments Tab */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Assigned Content ({assignmentsData?.assignments?.length ?? 0})
            </h2>
            <Button size="sm" onClick={() => setAssignSheetOpen(true)}>
              <Plus className="h-3.5 w-3.5" />
              Assign Content
            </Button>
          </div>

          {assignmentsLoading && (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-xl bg-white/5"
                />
              ))}
            </div>
          )}

          {!assignmentsLoading &&
            (assignmentsData?.assignments?.length ?? 0) === 0 && (
              <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
                <CardContent>
                  <div className="flex flex-col items-center py-8 text-center">
                    <ClipboardList className="h-10 w-10 text-white/20 mb-3" />
                    <p className="text-sm text-white/40">
                      No content assigned yet
                    </p>
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-3"
                      onClick={() => setAssignSheetOpen(true)}
                    >
                      Assign Content
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

          <div className="space-y-3">
            {assignmentsData?.assignments?.map((assignment) => (
              <Card
                key={assignment.id}
                className="bg-white/5 backdrop-blur-xl ring-white/12"
              >
                <CardContent className="pt-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-medium text-white/90 truncate">
                          {assignment.content?.title ??
                            `Content ${assignment.contentId}`}
                        </h3>
                        <Badge
                          className={`shrink-0 text-[11px] py-2 ${ASSIGNMENT_STATUS_STYLES[assignment.status] ?? ''}`}
                        >
                          {String(assignment.status ?? '').replace('_', ' ') || 'unknown'}
                        </Badge>
                      </div>

                      {/* Progress bar */}
                      <div className="flex items-center gap-3">
                        <div className="h-2 flex-1 rounded-full bg-white/10">
                          <div
                            className="h-full rounded-full bg-blue-500 transition-all"
                            style={{
                              width: `${assignment.progress}%`,
                            }}
                          />
                        </div>
                        <span className="text-xs text-white/50">
                          {assignment.progress}%
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-white/40">
                        {assignment.dueDate && (
                          <span>
                            Due:{' '}
                            {new Date(
                              assignment.dueDate,
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {assignment.startedAt && (
                          <span>
                            Started:{' '}
                            {new Date(
                              assignment.startedAt,
                            ).toLocaleDateString()}
                          </span>
                        )}
                        {assignment.completedAt && (
                          <span>
                            Completed:{' '}
                            {new Date(
                              assignment.completedAt,
                            ).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          setProgressDialog({
                            studentId: assignment.studentId,
                            contentId: assignment.contentId,
                          })
                        }
                      >
                        View Progress
                      </Button>
                      {assignment.status !== 'COMPLETED' && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <Trash2 className="h-3.5 w-3.5 text-red-400" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Remove assignment?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This will remove this content assignment from the
                                student.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  handleRemoveAssignment(assignment)
                                }
                              >
                                Remove
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <AssignContentSheet
            studentId={studentId}
            studentName={student.fullName}
            open={assignSheetOpen}
            onOpenChange={setAssignSheetOpen}
          />

          {progressDialog && (
            <ProgressDetailDialog
              studentId={progressDialog.studentId}
              contentId={progressDialog.contentId}
              studentName={student.fullName}
              open={!!progressDialog}
              onOpenChange={(open) => {
                if (!open) setProgressDialog(null)
              }}
            />
          )}
        </div>
      )}
    </div>
  )
}
