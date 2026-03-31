import { useApiQuery, useApiMutation } from './use-api'
import { classApi } from '@/lib/api'
import { toast } from 'sonner'
import type {
  Class,
  ClassResponse,
  ClassTeacherItem,
  ClassStudentItem,
  PageMeta,
  UpdateClassPayload,
} from '@/lib/types'

type ClassListData = {
  classes: Class[]
  meta?: PageMeta
}

export function useClasses(params?: {
  page?: number
  pageSize?: number
  search?: string
}) {
  return useApiQuery<ClassListData>(
    ['classes', params?.page, params?.pageSize, params?.search],
    async () => {
      const result = await classApi.getAll({
        page: (params?.page ?? 0) + 1,
        pageSize: params?.pageSize ?? 12,
        search: params?.search || undefined,
      })
      return {
        classes: result.data,
        meta: result.meta,
      }
    },
  )
}

export function useClass(id: string) {
  return useApiQuery<ClassResponse>(['class', id], () => classApi.getById(id), {
    enabled: !!id,
  })
}

export function useCreateClass() {
  return useApiMutation(classApi.create, {
    invalidateQueries: ['classes'],
    onSuccess: () => {
      toast.success('Class created successfully')
    },
  })
}

export function useUpdateClass() {
  return useApiMutation(
    ({ id, data }: { id: string; data: UpdateClassPayload }) =>
      classApi.update(id, data),
    {
      invalidateQueries: ['classes'],
      onSuccess: () => {
        toast.success('Class updated successfully')
      },
    },
  )
}

export function useDeleteClass() {
  return useApiMutation(classApi.delete, {
    invalidateQueries: ['classes'],
    onSuccess: () => {
      toast.success('Class deleted')
    },
  })
}

// --- Teacher membership ---

type ClassTeachersData = {
  teachers: ClassTeacherItem[]
  meta?: PageMeta
}

export function useClassTeachers(
  classId: string,
  params?: { page?: number; pageSize?: number; search?: string },
) {
  return useApiQuery<ClassTeachersData>(
    ['class-teachers', classId, params?.page, params?.search],
    async () => {
      const result = await classApi.getTeachers(classId, {
        page: (params?.page ?? 0) + 1,
        pageSize: params?.pageSize ?? 10,
        search: params?.search || undefined,
      })
      return {
        teachers: result.data,
        meta: result.meta,
      }
    },
    { enabled: !!classId },
  )
}

export function useAddTeachers() {
  return useApiMutation(
    ({ classId, customerIds }: { classId: string; customerIds: string[] }) =>
      classApi.addTeachers(classId, customerIds),
    {
      invalidateQueries: ['class-teachers', 'class'],
      onSuccess: () => {
        toast.success('Teachers added to class')
      },
    },
  )
}

export function useRemoveTeacher() {
  return useApiMutation(
    ({ classId, customerId }: { classId: string; customerId: string }) =>
      classApi.removeTeacher(classId, customerId),
    {
      invalidateQueries: ['class-teachers', 'class'],
      onSuccess: () => {
        toast.success('Teacher removed from class')
      },
    },
  )
}

// --- Student membership ---

type ClassStudentsData = {
  students: ClassStudentItem[]
  meta?: PageMeta
}

export function useClassStudents(
  classId: string,
  params?: { page?: number; pageSize?: number; search?: string },
) {
  return useApiQuery<ClassStudentsData>(
    ['class-students', classId, params?.page, params?.search],
    async () => {
      const result = await classApi.getStudents(classId, {
        page: (params?.page ?? 0) + 1,
        pageSize: params?.pageSize ?? 10,
        search: params?.search || undefined,
      })
      return {
        students: result.data,
        meta: result.meta,
      }
    },
    { enabled: !!classId },
  )
}

export function useAddStudents() {
  return useApiMutation(
    ({ classId, studentIds }: { classId: string; studentIds: string[] }) =>
      classApi.addStudents(classId, studentIds),
    {
      invalidateQueries: ['class-students', 'class'],
      onSuccess: () => {
        toast.success('Students added to class')
      },
    },
  )
}

export function useRemoveStudent() {
  return useApiMutation(
    ({ classId, studentId }: { classId: string; studentId: string }) =>
      classApi.removeStudent(classId, studentId),
    {
      invalidateQueries: ['class-students', 'class'],
      onSuccess: () => {
        toast.success('Student removed from class')
      },
    },
  )
}
