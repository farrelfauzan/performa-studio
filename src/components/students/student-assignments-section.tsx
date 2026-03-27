import { useState } from 'react'
import { ClipboardList, Plus, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
import {
  useStudentAssignments,
  useDeleteAssignment,
} from '@/hooks/use-assignments'
import { AssignContentSheet } from '@/components/students/assign-content-sheet'
import { ProgressDetailDialog } from '@/components/students/progress-detail-dialog'
import type { Assignment } from '@/lib/types'

const ASSIGNMENT_STATUS_STYLES: Record<string, string> = {
  ASSIGNED: 'bg-blue-500/15 text-blue-400 border-transparent',
  IN_PROGRESS: 'bg-yellow-500/15 text-yellow-400 border-transparent',
  COMPLETED: 'bg-green-500/15 text-green-400 border-transparent',
  OVERDUE: 'bg-red-500/15 text-red-400 border-transparent',
}

export function StudentAssignmentsSection({
  studentId,
  studentName,
}: {
  studentId: string
  studentName: string
}) {
  const { data: assignmentsData, isLoading } =
    useStudentAssignments(studentId)
  const { mutate: deleteAssignment } = useDeleteAssignment()

  const [assignSheetOpen, setAssignSheetOpen] = useState(false)
  const [progressDialog, setProgressDialog] = useState<{
    studentId: string
    contentId: string
  } | null>(null)

  const handleRemoveAssignment = (assignment: Assignment) => {
    deleteAssignment({
      studentId: assignment.studentId,
      contentId: assignment.contentId,
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Assignments ({assignmentsData?.assignments?.length ?? 0})
        </h2>
        <Button size="sm" onClick={() => setAssignSheetOpen(true)}>
          <Plus className="h-3.5 w-3.5" />
          Assign Content
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card
              key={i}
              className="bg-white/5 backdrop-blur-xl ring-white/12 animate-pulse"
            >
              <CardContent className="pt-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-48 rounded bg-white/10" />
                      <div className="h-5 w-20 rounded-full bg-white/8" />
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="h-2 flex-1 rounded-full bg-white/10" />
                      <div className="h-3 w-8 rounded bg-white/8" />
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="h-3 w-24 rounded bg-white/5" />
                      <div className="h-3 w-28 rounded bg-white/5" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-24 rounded-md bg-white/8" />
                    <div className="h-8 w-8 rounded-md bg-white/5" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (assignmentsData?.assignments?.length ?? 0) === 0 ? (
        <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
          <CardContent>
            <div className="flex flex-col items-center py-8 text-center">
              <ClipboardList className="h-10 w-10 text-white/20 mb-3" />
              <p className="text-sm text-white/40">No content assigned yet</p>
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
      ) : null}

      <div className="space-y-3">
        {!isLoading && assignmentsData?.assignments?.map((assignment) => (
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
                      {String(assignment.status ?? '')
                        .replace('_', ' ')
                        || 'unknown'}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-2 flex-1 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-blue-500 transition-all"
                        style={{ width: `${assignment.progress}%` }}
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
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </span>
                    )}
                    {assignment.startedAt && (
                      <span>
                        Started:{' '}
                        {new Date(assignment.startedAt).toLocaleDateString()}
                      </span>
                    )}
                    {assignment.completedAt && (
                      <span>
                        Completed:{' '}
                        {new Date(assignment.completedAt).toLocaleDateString()}
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
                            onClick={() => handleRemoveAssignment(assignment)}
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
        studentName={studentName}
        open={assignSheetOpen}
        onOpenChange={setAssignSheetOpen}
      />

      {progressDialog && (
        <ProgressDetailDialog
          studentId={progressDialog.studentId}
          contentId={progressDialog.contentId}
          studentName={studentName}
          open={!!progressDialog}
          onOpenChange={(open) => {
            if (!open) setProgressDialog(null)
          }}
        />
      )}
    </div>
  )
}
