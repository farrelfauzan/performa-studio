import { useApiQuery } from '@/hooks/use-api'
import type { StudioProject } from '@/lib/dummy-data'
import { STUDIO_PROJECTS } from '@/lib/dummy-data'

// TODO: Replace with real API calls via apiClient
// import apiClient from '@/lib/api-client'

type StudioData = {
  projects: StudioProject[]
}

async function getStudioData(): Promise<StudioData> {
  // TODO: return apiClient.get<StudioData>('/studio/projects')
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { projects: STUDIO_PROJECTS }
}

export function useStudioProjects() {
  return useApiQuery('studio-projects', getStudioData)
}
