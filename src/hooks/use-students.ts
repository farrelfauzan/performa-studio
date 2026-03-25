import { useApiQuery, useApiMutation } from './use-api'
import { studentApi } from '@/lib/api'
import { toast } from 'sonner'
import type {
  Student,
  StudentResponse,
  PageMeta,
  UpdateStudentPayload,
} from '@/lib/types'

type StudentListData = {
  students: Student[]
  meta?: PageMeta
}

export function useStudents(params?: {
  page?: number
  pageSize?: number
  search?: string
}) {
  return useApiQuery<StudentListData>(
    ['students', params?.page, params?.pageSize, params?.search],
    async () => {
      const result = await studentApi.getAll({
        page: (params?.page ?? 0) + 1,
        pageSize: params?.pageSize ?? 12,
        search: params?.search || undefined,
      })
      return {
        students: result.data,
        meta: result.meta,
      }
    },
  )
}

export function useStudent(id: string) {
  return useApiQuery<StudentResponse>(
    ['student', id],
    () => studentApi.getById(id),
    { enabled: !!id },
  )
}

export function useCreateStudent() {
  return useApiMutation(studentApi.create, {
    invalidateQueries: ['students'],
    onSuccess: () => {
      toast.success('Student created successfully')
    },
  })
}

export function useUpdateStudent() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateStudentPayload }) =>
      studentApi.update(id, data),
    {
      invalidateQueries: ['students'],
      onSuccess: () => {
        toast.success('Student updated successfully')
      },
    },
  )
}

export function useDeleteStudent() {
  return useApiMutation(studentApi.delete, {
    invalidateQueries: ['students'],
    onSuccess: () => {
      toast.success('Student deleted')
    },
  })
}
