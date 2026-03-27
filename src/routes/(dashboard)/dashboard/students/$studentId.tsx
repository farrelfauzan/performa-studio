import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useStudent, useDeleteStudent } from '@/hooks/use-students'
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
import { StudentProfileSection } from '@/components/students/student-profile-section'
import { StudentAssignmentsSection } from '@/components/students/student-assignments-section'
import { StudentAnalyticsSection } from '@/components/students/student-analytics-section'

export const Route = createFileRoute(
  '/(dashboard)/dashboard/students/$studentId',
)({
  component: StudentDetailPage,
})

function StudentDetailPage() {
  const { studentId } = Route.useParams()
  const navigate = useNavigate()

  const { data: studentData, isLoading } = useStudent(studentId)
  const { mutate: deleteStudent } = useDeleteStudent()

  const student = studentData?.data ?? null

  if (isLoading) {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon-sm"
            onClick={() => navigate({ to: '/dashboard/students', search: { page: 0, q: '' } })}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold text-white">{student.fullName}</h1>
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

      {/* Profile */}
      <StudentProfileSection studentId={studentId} />

      {/* Assignments */}
      <StudentAssignmentsSection
        studentId={studentId}
        studentName={student.fullName}
      />

      {/* Analytics */}
      <StudentAnalyticsSection studentId={studentId} />
    </div>
  )
}
