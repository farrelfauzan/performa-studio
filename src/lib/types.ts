// ─── Auth Types ──────────────────────────────────────────────────────────

export type LoginRequest = {
  usernameOrEmail: string
  password: string
}

export type LoginResponse = {
  data: {
    accessToken: string
    refreshToken: string
    user?: {
      id: string
      username: string
      email: string
    }
  }
}

export type ProfileResponse = {
  data: {
    id: string
    username: string
    uniqueId: string
    email: string
    roles: {
      id: string
      name: string
      permissions: string[]
    }[]
    fullName: string | null
    profilePicture: string | null
    dateOfBirth: string | null
    phoneNumber: string | null
    address: string | null
    createdAt: string
    updatedAt: string
    deletedAt: string | null
    userId: string | null
  }
}

export type SessionUser = {
  id: string
  email: string
  name: string
  role: string
  profilePicture: string | null
}

// ─── Password Reset Types ───────────────────────────────────────────────

export type RequestPasswordResetRequest = {
  email: string
}

export type RequestPasswordResetResponse = {
  data: {
    message: string
    resetToken: string
  }
}

export type ResetPasswordRequest = {
  token: string
  newPassword: string
}

export type ResetPasswordResponse = {
  data: {
    message: string
  }
}

// ─── Pagination ─────────────────────────────────────────────────────────

export type PageMeta = {
  page: number
  pageSize: number
  itemCount: number
  pageCount: number
  hasPreviousPage: boolean
  hasNextPage: boolean
}

export type PaginatedResponse<T> = {
  data: T[]
  meta: PageMeta
}

export type PageParams = {
  page?: number
  pageSize?: number
  sortBy?: string
  order?: 'ASC' | 'DESC'
  search?: string
  query?: string
}

// ─── Content Types ──────────────────────────────────────────────────────

export enum ContentStatus {
  DRAFT = 0,
  PUBLISHED = 1,
  ARCHIVED = 2,
}

export type ContentMediaType = 0 | 1 // 0=IMAGE, 1=VIDEO

export type ContentProcessingStatus = 0 | 1 | 2 | 3 // PENDING, PROCESSING, COMPLETED, FAILED

export type ContentMedia = {
  id: string
  contentId: string
  sectionId: string | null
  mediaType: ContentMediaType
  originalUrl: string | null
  hlsUrl: string | null
  thumbnailUrl: string | null
  objectPath: string | null
  fileName: string | null
  fileSize: string | null
  mimeType: string | null
  processingStatus: ContentProcessingStatus
  processedAt: string | null
  sortOrder: number
  title: string | null
  createdAt: string
  updatedAt: string
}

export type ContentSection = {
  id: string
  contentId: string
  title: string
  description: string | null
  sortOrder: number
  medias: ContentMedia[]
  createdAt: string
  updatedAt: string
}

export type Content = {
  id: string
  userId: string
  title: string
  body: string | null
  year: number | null
  categoryId: string | null
  status: ContentStatus
  thumbnailUrl: string | null
  previewUrl: string | null
  createdAt: string
  updatedAt: string
  deletedAt: string | null
  sections?: ContentSection[]
  contentMedias?: ContentMedia[]
}

export type GetAllContentsResponse = PaginatedResponse<Content>

export type GetContentByIdResponse = {
  data: {
    content: Content
    media: ContentMedia[]
  }
}

// ─── Content Creation Types ─────────────────────────────────────────────

export type CreateSectionVideoInput = {
  title: string
  sortOrder: number
  fileName: string
  mimeType: string
  fileSize: number
}

export type CreateSectionInput = {
  title: string
  description?: string
  sortOrder: number
  videos: CreateSectionVideoInput[]
}

export type FileInput = {
  fileName: string
  mimeType: string
  fileSize: number
}

export type CreateContentWithSectionsRequest = {
  title: string
  categoryId: string
  year: number
  body: string
  status: number
  sections: CreateSectionInput[]
  thumbnail?: FileInput
  previewVideo?: FileInput
}

export type UploadUrlInfo = {
  mediaId: string
  uploadUrl: string
  fields: Record<string, string>
  s3Key: string
  expiresIn: number
}

export type CreateContentWithSectionsResponse = {
  data: {
    content: Content
    sections: ContentSection[]
    uploadUrls: UploadUrlInfo[]
    thumbnailUploadUrl?: UploadUrlInfo
    previewUploadUrl?: UploadUrlInfo
  }
}

export type ConversionJobInfo = {
  mediaId: string
  jobId: string
}

export type StartConversionResponse = {
  data: {
    jobs: ConversionJobInfo[]
  }
}

// ─── Content Update Types ───────────────────────────────────────────────

export type UpdateContentRequest = {
  title?: string
  body?: string
  status?: number
}

export type UpdateContentResponse = {
  data: Content
}

export type DeleteContentResponse = {
  data: { success: boolean }
}
