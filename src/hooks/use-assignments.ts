import { useApiQuery, useApiMutation } from './use-api'
import { assignmentApi } from '@/lib/api'
import { toast } from 'sonner'
import type {
  Assignment,
  BulkAssignmentResponse,
  PageMeta,
  ProgressLogsResponse,
} from '@/lib/types'

type AssignmentListData = {
  assignments: Assignment[]
  meta?: PageMeta
}

export function useTeacherAssignments(params?: {
  page?: number
  pageSize?: number
  search?: string
}) {
  return useApiQuery<AssignmentListData>(
    ['teacher-assignments', params?.page, params?.pageSize, params?.search],
    async () => {
      const result = await assignmentApi.getTeacherAssignments({
        page: (params?.page ?? 0) + 1,
        pageSize: params?.pageSize ?? 12,
        search: params?.search || undefined,
      })
      return {
        assignments: result.data,
        meta: result.meta,
      }
    },
  )
}

export function useStudentAssignments(studentId: string) {
  return useApiQuery<AssignmentListData>(
    ['student-assignments', studentId],
    async () => {
      const result = await assignmentApi.getStudentAssignments(studentId)
      return {
        assignments: result.data,
        meta: result.meta,
      }
    },
    { enabled: !!studentId },
  )
}

export function useContentAssignments(contentId: string) {
  return useApiQuery<AssignmentListData>(
    ['content-assignments', contentId],
    async () => {
      const result = await assignmentApi.getContentAssignments(contentId)
      return {
        assignments: result.data,
        meta: result.meta,
      }
    },
    { enabled: !!contentId },
  )
}

export function useCreateAssignment() {
  return useApiMutation(assignmentApi.create, {
    invalidateQueries: [
      'teacher-assignments',
      'student-assignments',
      'content-assignments',
    ],
    onSuccess: () => {
      toast.success('Content assigned successfully')
    },
  })
}

export function useBulkCreateAssignment() {
  return useApiMutation(assignmentApi.bulkCreate, {
    invalidateQueries: [
      'teacher-assignments',
      'student-assignments',
      'content-assignments',
    ],
    onSuccess: (data: BulkAssignmentResponse) => {
      toast.success(
        `Assigned to ${data.data.created} students (${data.data.skipped} skipped)`,
      )
    },
  })
}

export function useDeleteAssignment() {
  return useApiMutation(
    ({ studentId, contentId }: { studentId: string; contentId: string }) =>
      assignmentApi.delete(studentId, contentId),
    {
      invalidateQueries: [
        'teacher-assignments',
        'student-assignments',
        'content-assignments',
      ],
      onSuccess: () => {
        toast.success('Assignment removed')
      },
    },
  )
}

export function useProgressLogs(studentId: string, contentId: string) {
  return useApiQuery<ProgressLogsResponse>(
    ['progress-logs', studentId, contentId],
    () => assignmentApi.getProgressLogs(studentId, contentId),
    { enabled: !!studentId && !!contentId },
  )
}
