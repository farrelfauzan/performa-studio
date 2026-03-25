import apiClient from './api-client'
import type {
  LoginRequest,
  LoginResponse,
  ProfileResponse,
  RequestPasswordResetRequest,
  RequestPasswordResetResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
  GetAllContentsResponse,
  GetContentByIdResponse,
  CreateContentWithSectionsRequest,
  CreateContentWithSectionsResponse,
  StartConversionResponse,
  UpdateContentRequest,
  UpdateContentResponse,
  DeleteContentResponse,
  PageParams,
  Category,
  StudentListResponse,
  StudentResponse,
  CreateStudentPayload,
  UpdateStudentPayload,
  AssignmentListResponse,
  BulkAssignmentResponse,
  BulkCreateAssignmentPayload,
  CreateAssignmentPayload,
  ProgressLogsResponse,
} from './types'

// ─── Auth API ────────────────────────────────────────────────────────────

export const authApi = {
  login: (data: LoginRequest) =>
    apiClient.post<LoginResponse>('/v1/auth/login', data),

  getMe: () => apiClient.get<ProfileResponse>('/v1/auth/getMe'),

  requestPasswordReset: (data: RequestPasswordResetRequest) =>
    apiClient.post<RequestPasswordResetResponse>(
      '/v1/auth/request-password-reset',
      data,
    ),

  resetPassword: (data: ResetPasswordRequest) =>
    apiClient.post<ResetPasswordResponse>('/v1/auth/reset-password', data),

  updateProfile: (data: {
    fullName?: string
    profilePictureUrl?: string
    bio?: string
  }) => apiClient.put<ProfileResponse>('/v1/auth/profile', data),

  getProfilePictureUploadUrl: (data: {
    filename: string
    contentType: string
  }) =>
    apiClient.post<{
      data: {
        uploadUrl: string
        fields: Record<string, string>
        s3Key: string
        publicUrl: string
        expiresIn: number
      }
    }>('/v1/auth/profile/upload-url', data),
}

// ─── Content API ─────────────────────────────────────────────────────────

export const contentApi = {
  getAll: (params?: PageParams) =>
    apiClient.get<GetAllContentsResponse>('/v1/contents', { params }),

  getById: (id: string) =>
    apiClient.get<GetContentByIdResponse>(
      `/v1/contents/${encodeURIComponent(id)}`,
    ),

  getCategories: () =>
    apiClient.get<{ data: Category[] }>('/v1/contents/categories'),

  create: (data: CreateContentWithSectionsRequest) =>
    apiClient.post<CreateContentWithSectionsResponse>(
      '/v1/contents/with-sections',
      data,
    ),

  startConversion: (contentId: string, callbackUrl?: string) =>
    apiClient.post<StartConversionResponse>(
      `/v1/contents/${encodeURIComponent(contentId)}/convert`,
      callbackUrl ? { callbackUrl } : {},
    ),

  update: (id: string, data: UpdateContentRequest) =>
    apiClient.put<UpdateContentResponse>(
      `/v1/contents/${encodeURIComponent(id)}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete<DeleteContentResponse>(
      `/v1/contents/${encodeURIComponent(id)}`,
    ),
}

// ─── Student API ─────────────────────────────────────────────────────────

export const studentApi = {
  getAll: (params?: PageParams) =>
    apiClient.get<StudentListResponse>('/v1/students', { params }),

  getById: (id: string) =>
    apiClient.get<StudentResponse>(`/v1/students/${encodeURIComponent(id)}`),

  create: (data: CreateStudentPayload) =>
    apiClient.post<StudentResponse>('/v1/students', data),

  update: (id: string, data: UpdateStudentPayload) =>
    apiClient.put<StudentResponse>(
      `/v1/students/${encodeURIComponent(id)}`,
      data,
    ),

  delete: (id: string) =>
    apiClient.delete(`/v1/students/${encodeURIComponent(id)}`),

  getProfileUploadUrl: (data: { filename: string; contentType: string }) =>
    apiClient.post<{
      data: {
        uploadUrl: string
        fields: Record<string, string>
        s3Key: string
        publicUrl: string
        expiresIn: number
      }
    }>('/v1/students/profile/upload-url', data),
}

// ─── Assignment API ──────────────────────────────────────────────────────

export const assignmentApi = {
  create: (data: CreateAssignmentPayload) =>
    apiClient.post<AssignmentListResponse>('/v1/assignments', data),

  bulkCreate: (data: BulkCreateAssignmentPayload) =>
    apiClient.post<BulkAssignmentResponse>('/v1/assignments/bulk', data),

  delete: (studentId: string, contentId: string) =>
    apiClient.delete(
      `/v1/assignments/${encodeURIComponent(studentId)}/${encodeURIComponent(contentId)}`,
    ),

  getTeacherAssignments: (params?: PageParams) =>
    apiClient.get<AssignmentListResponse>('/v1/assignments/teacher', {
      params,
    }),

  getStudentAssignments: (studentId: string, params?: PageParams) =>
    apiClient.get<AssignmentListResponse>(
      `/v1/assignments/student/${encodeURIComponent(studentId)}`,
      { params },
    ),

  getContentAssignments: (contentId: string, params?: PageParams) =>
    apiClient.get<AssignmentListResponse>(
      `/v1/assignments/content/${encodeURIComponent(contentId)}`,
      { params },
    ),

  getProgressLogs: (studentId: string, contentId: string) =>
    apiClient.get<ProgressLogsResponse>(
      `/v1/assignments/${encodeURIComponent(studentId)}/${encodeURIComponent(contentId)}/progress`,
    ),
}

// ─── S3 Upload Helper ────────────────────────────────────────────────────

export async function uploadToS3(
  uploadUrl: string,
  fields: Record<string, string>,
  file: File,
): Promise<void> {
  const formData = new FormData()

  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value)
  }
  formData.append('file', file)

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
}
