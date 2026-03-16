import { useApiQuery } from '@/hooks/use-api'
import type {
  DashboardStat,
  ActivityItem,
  MostWatchedVideo,
  StudioProject,
} from '@/lib/dummy-data'
import {
  DASHBOARD_STATS,
  DASHBOARD_ACTIVITY,
  MOST_WATCHED_VIDEOS,
  STUDIO_PROJECTS,
} from '@/lib/dummy-data'

// TODO: Replace with real API calls via apiClient
// import apiClient from '@/lib/api-client'

type DashboardData = {
  stats: DashboardStat[]
  activity: ActivityItem[]
  mostWatched: MostWatchedVideo[]
  drafts: StudioProject[]
}

async function getDashboardData(): Promise<DashboardData> {
  // TODO: return apiClient.get<DashboardData>('/dashboard')
  await new Promise((resolve) => setTimeout(resolve, 800))
  return {
    stats: DASHBOARD_STATS,
    activity: DASHBOARD_ACTIVITY.slice(0, 3),
    mostWatched: MOST_WATCHED_VIDEOS,
    drafts: STUDIO_PROJECTS.filter(
      (p) => p.status === 'draft' || p.status === 'in-progress',
    ).slice(0, 4),
  }
}

export function useDashboardData() {
  return useApiQuery('dashboard', getDashboardData)
}
