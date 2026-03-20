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
}

// ─── Content API ─────────────────────────────────────────────────────────

export const contentApi = {
  getAll: (params?: PageParams) =>
    apiClient.get<GetAllContentsResponse>('/v1/contents', { params }),

  getById: (id: string) =>
    apiClient.get<GetContentByIdResponse>(
      `/v1/contents/${encodeURIComponent(id)}`,
    ),

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
