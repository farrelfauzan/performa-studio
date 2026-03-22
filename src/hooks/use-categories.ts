import { useApiQuery } from '@/hooks/use-api'
import { contentApi } from '@/lib/api'
import type { Category } from '@/lib/types'

export function useCategories() {
  return useApiQuery<Category[]>('categories', async () => {
    const res = await contentApi.getCategories()
    return res.data ?? []
  })
}
