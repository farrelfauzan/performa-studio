import { useApiQuery } from '@/hooks/use-api'
import { contentApi } from '@/lib/api'
import type { Content, ContentMedia } from '@/lib/types'

export function useContentDetail(contentId: string) {
  return useApiQuery<{ content: Content; media: ContentMedia[] }>(
    ['content', contentId],
    async () => {
      const result = await contentApi.getById(contentId)
      return result.data
    },
  )
}
