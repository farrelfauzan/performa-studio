import { useApiQuery } from '@/hooks/use-api'
import { contentApi } from '@/lib/api'
import type { Content, PageMeta, ContentStatus } from '@/lib/types'

type StudioData = {
  projects: Content[]
  meta?: PageMeta
}

export function useStudioProjects(params?: {
  page?: number
  pageSize?: number
  search?: string
}) {
  return useApiQuery<StudioData>(
    ['studio-projects', params?.page, params?.pageSize, params?.search],
    async () => {
      const result = await contentApi.getAll({
        page: (params?.page ?? 0) + 1,
        pageSize: params?.pageSize ?? 12,
        search: params?.search || undefined,
      })
      return {
        projects: result.data,
        meta: result.meta,
      }
    },
  )
}

// ─── Helpers ─────────────────────────────────────────────────────────────

const STATUS_MAP: Record<ContentStatus, string> = {
  0: 'draft',
  1: 'published',
  2: 'archived',
}

export function getContentStatusLabel(status: ContentStatus): string {
  return STATUS_MAP[status] ?? 'draft'
}
