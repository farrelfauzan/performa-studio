import { useApiQuery, useApiMutation } from '@/hooks/use-api'
import { quizApi, uploadToS3 } from '@/lib/api'
import type {
  Quiz,
  Question,
  PageMeta,
  CreateQuizPayload,
  UpdateQuizPayload,
  AddQuestionPayload,
  UpdateQuestionPayload,
  QuizAnalytics,
} from '@/lib/types'

type QuizListData = {
  quizzes: Quiz[]
  meta?: PageMeta
}

export function useQuizzes(params?: {
  page?: number
  pageSize?: number
  search?: string
  isPublished?: boolean
}) {
  return useApiQuery<QuizListData>(
    [
      'quizzes',
      params?.page,
      params?.pageSize,
      params?.search,
      params?.isPublished,
    ],
    async () => {
      const result = await quizApi.getAll({
        page: (params?.page ?? 0) + 1,
        pageSize: params?.pageSize ?? 10,
        search: params?.search || undefined,
        isPublished: params?.isPublished,
      })
      return {
        quizzes: result.data,
        meta: result.meta,
      }
    },
  )
}

export function useQuiz(id: string) {
  return useApiQuery<Quiz>(
    ['quiz', id],
    async () => {
      const result = await quizApi.getById(id)
      return result.data
    },
    { enabled: !!id },
  )
}

export function useCreateQuiz() {
  return useApiMutation<{ data: Quiz }, CreateQuizPayload>(
    (data) => quizApi.create(data),
    { invalidateQueries: ['quizzes'] },
  )
}

export function useUpdateQuiz(id: string) {
  return useApiMutation<{ data: Quiz }, UpdateQuizPayload>(
    (data) => quizApi.update(id, data),
    { invalidateQueries: ['quizzes', ['quiz', id]] },
  )
}

export function useDeleteQuiz() {
  return useApiMutation<unknown, string>((id) => quizApi.delete(id), {
    invalidateQueries: ['quizzes'],
  })
}

export function usePublishQuiz() {
  return useApiMutation<{ data: Quiz }, string>((id) => quizApi.publish(id), {
    invalidateQueries: ['quizzes'],
  })
}

export function useUnpublishQuiz() {
  return useApiMutation<{ data: Quiz }, string>((id) => quizApi.unpublish(id), {
    invalidateQueries: ['quizzes'],
  })
}

export function useAddQuestion(quizId: string) {
  return useApiMutation<{ data: Question }, AddQuestionPayload>(
    (data) => quizApi.addQuestion(quizId, data),
    { invalidateQueries: [['quiz', quizId]] },
  )
}

export function useUpdateQuestion(quizId: string) {
  return useApiMutation<
    { data: Question },
    { questionId: string; data: UpdateQuestionPayload }
  >(
    ({ questionId, data }) => quizApi.updateQuestion(quizId, questionId, data),
    { invalidateQueries: [['quiz', quizId]] },
  )
}

export function useDeleteQuestion(quizId: string) {
  return useApiMutation<unknown, string>(
    (questionId) => quizApi.deleteQuestion(quizId, questionId),
    { invalidateQueries: [['quiz', quizId]] },
  )
}

export function useReorderQuestions(quizId: string) {
  return useApiMutation<unknown, string[]>(
    (questionIds) => quizApi.reorderQuestions(quizId, questionIds),
    { invalidateQueries: [['quiz', quizId]] },
  )
}

export function useQuizAnalytics(quizId: string) {
  return useApiQuery<QuizAnalytics>(
    ['quiz-analytics', quizId],
    async () => {
      const result = await quizApi.getAnalytics(quizId)
      return result.data
    },
    { enabled: !!quizId },
  )
}

export function useUploadQuestionPicture(quizId: string) {
  return useApiMutation<string, { questionId: string; file: File }>(
    async ({ questionId, file }) => {
      const { data } = await quizApi.getQuestionPictureUploadUrl(
        quizId,
        questionId,
        { filename: file.name, contentType: file.type },
      )
      await uploadToS3(data.uploadUrl, data.fields, file)
      return data.publicUrl
    },
    { invalidateQueries: [['quiz', quizId]] },
  )
}
