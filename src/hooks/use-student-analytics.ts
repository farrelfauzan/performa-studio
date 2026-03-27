import { useApiQuery } from './use-api'

export type StudentAnalytics = {
  totalAssignments: number
  completedAssignments: number
  inProgressAssignments: number
  overdueAssignments: number
  averageProgress: number
  averageScore: number
  completionRate: number
  weeklyActivity: { week: string; completed: number; assigned: number }[]
  recentScores: { content: string; score: number; date: string }[]
}

// TODO: Replace with real API call when service is ready
function generateDummyAnalytics(studentId: string): StudentAnalytics {
  // Use studentId to seed slightly different data per student
  const seed = studentId.charCodeAt(0) % 10

  const totalAssignments = 8 + seed
  const completedAssignments = Math.min(3 + seed, totalAssignments)
  const inProgressAssignments = Math.min(
    2,
    totalAssignments - completedAssignments,
  )
  const overdueAssignments = Math.max(
    0,
    totalAssignments - completedAssignments - inProgressAssignments,
  )
  const averageProgress =
    Math.round(
      ((completedAssignments * 100 +
        inProgressAssignments * 45 +
        overdueAssignments * 10) /
        totalAssignments) *
        100,
    ) / 100
  const averageScore = 72 + seed * 2.5
  const completionRate = Math.round(
    (completedAssignments / totalAssignments) * 100,
  )

  const weeklyActivity = [
    { week: 'Week 1', completed: 1 + (seed % 2), assigned: 2 },
    { week: 'Week 2', completed: 2, assigned: 3 },
    { week: 'Week 3', completed: 1, assigned: 1 + (seed % 3) },
    { week: 'Week 4', completed: seed % 3, assigned: 2 },
  ]

  const recentScores = [
    {
      content: 'Introduction to Music Theory',
      score: 85 + seed,
      date: '2026-03-20',
    },
    { content: 'Rhythm & Timing Basics', score: 78 + seed, date: '2026-03-15' },
    { content: 'Chord Progressions', score: 90 - seed, date: '2026-03-10' },
    {
      content: 'Ear Training Level 1',
      score: 65 + seed * 2,
      date: '2026-03-05',
    },
  ]

  return {
    totalAssignments,
    completedAssignments,
    inProgressAssignments,
    overdueAssignments,
    averageProgress,
    averageScore,
    completionRate,
    weeklyActivity,
    recentScores,
  }
}

export function useStudentAnalytics(studentId: string) {
  return useApiQuery<StudentAnalytics>(
    ['student-analytics', studentId],
    async () => {
      // TODO: Replace with real API call
      // const result = await studentApi.getAnalytics(studentId)
      // return result.data
      await new Promise((r) => setTimeout(r, 400)) // simulate network
      return generateDummyAnalytics(studentId)
    },
    { enabled: !!studentId },
  )
}
