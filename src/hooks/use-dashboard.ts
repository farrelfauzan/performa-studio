import { useApiQuery } from '@/hooks/use-api'
import type { DashboardStat, ActivityItem } from '@/lib/dummy-data'
import { DASHBOARD_STATS, DASHBOARD_ACTIVITY } from '@/lib/dummy-data'

// TODO: Replace with real API calls via apiClient
// import apiClient from '@/lib/api-client'

type DashboardData = {
  stats: DashboardStat[]
  activity: ActivityItem[]
}

async function getDashboardData(): Promise<DashboardData> {
  // TODO: return apiClient.get<DashboardData>('/dashboard')
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { stats: DASHBOARD_STATS, activity: DASHBOARD_ACTIVITY }
}

export function useDashboardData() {
  return useApiQuery('dashboard', getDashboardData)
}
