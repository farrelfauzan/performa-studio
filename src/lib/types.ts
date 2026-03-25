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
  WAITING_REVIEW = 3,
}

export type ContentMediaType = 0 | 1 | 2 // 0=IMAGE, 1=VIDEO, 2=DOCUMENT

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
  downloadUrl: string | null
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

export type Category = {
  id: string
  name: string
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
  category?: Category | null
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

export type CreateSectionDocumentInput = {
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
  documents?: CreateSectionDocumentInput[]
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
    documentUploadUrls?: UploadUrlInfo[]
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

// ─── Student Types ──────────────────────────────────────────────────────

export type Student = {
  id: string
  userId: string
  uniqueId: string
  fullName: string
  phoneNumber: string | null
  dateOfBirth: string | null
  profilePictureUrl: string | null
  bio: string | null
  active: 'ACTIVE' | 'INACTIVE'
  createdAt: string
  updatedAt: string
}

export type CreateStudentPayload = {
  username: string
  email: string
  password: string
  fullName: string
  phoneNumber?: string
  dateOfBirth?: string
  profilePictureUrl?: string
}

export type UpdateStudentPayload = {
  fullName?: string
  phoneNumber?: string
  dateOfBirth?: string
  active?: 'ACTIVE' | 'INACTIVE'
}

export type StudentListResponse = PaginatedResponse<Student>

export type StudentResponse = {
  data: Student
}

// ─── Assignment Types ───────────────────────────────────────────────────

export type AssignmentStatus =
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'OVERDUE'

export type Assignment = {
  id: string
  teacherId: string
  studentId: string
  contentId: string
  status: AssignmentStatus
  progress: number
  dueDate: string | null
  assignedAt: string
  startedAt: string | null
  completedAt: string | null
  student?: Student
  content?: Content
  createdAt: string
  updatedAt: string
}

export type CreateAssignmentPayload = {
  studentId: string
  contentId: string
  dueDate?: string
}

export type BulkCreateAssignmentPayload = {
  studentIds: string[]
  contentId: string
  dueDate?: string
}

export type AssignmentListResponse = PaginatedResponse<Assignment>

export type BulkAssignmentResponse = {
  data: {
    assignments: Assignment[]
    created: number
    skipped: number
  }
}

export type ProgressLog = {
  id: string
  assignmentId: string
  sectionId: string | null
  questionId: string | null
  action: 'COMPLETE_SECTION' | 'ANSWER_QUESTION'
  createdAt: string
}

export type ProgressLogsResponse = {
  data: {
    logs: ProgressLog[]
    progress: number
    completedItems: number
    totalItems: number
  }
}
