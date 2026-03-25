import { CheckCircle2, Circle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { useProgressLogs } from '@/hooks/use-assignments'

interface ProgressDetailDialogProps {
  studentId: string
  contentId: string
  studentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ProgressDetailDialog({
  studentId,
  contentId,
  studentName,
  open,
  onOpenChange,
}: ProgressDetailDialogProps) {
  const { data, isLoading } = useProgressLogs(studentId, contentId)

  const progressData = data?.data

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle>Progress Detail</AlertDialogTitle>
          <p className="text-sm text-muted-foreground">
            Student: {studentName}
          </p>
        </AlertDialogHeader>

        {isLoading && (
          <div className="flex items-center justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        )}

        {progressData && (
          <div className="space-y-4">
            {/* Progress bar */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">
                  {progressData.completedItems}/{progressData.totalItems} items
                </span>
                <span className="font-medium text-white">
                  {progressData.progress}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all"
                  style={{ width: `${progressData.progress}%` }}
                />
              </div>
            </div>

            {/* Log entries */}
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {progressData.logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start gap-3 rounded-lg bg-white/5 p-3"
                >
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/80">
                      {log.action === 'COMPLETE_SECTION'
                        ? `Completed section`
                        : `Answered question`}
                      {log.sectionId && (
                        <span className="text-white/40">
                          {' '}
                          ({log.sectionId})
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-white/40">
                      {new Date(log.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}

              {progressData.logs.length === 0 && (
                <div className="flex flex-col items-center py-6 text-center">
                  <Circle className="h-8 w-8 text-white/20 mb-2" />
                  <p className="text-sm text-white/40">No progress yet</p>
                </div>
              )}
            </div>
          </div>
        )}

        <AlertDialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
