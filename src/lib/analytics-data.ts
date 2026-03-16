import dayjs from 'dayjs'

// ─── Types ──────────────────────────────────────────────────────────────

export type TimeSeriesPoint = {
  date: string
  value: number
}

export type ContentPerformance = {
  id: number
  title: string
  thumbnail: string
  views: number
  watchTimeHours: number
  impressions: number
  ctr: number
  avgViewDuration: string
}

export type AgeGroup = {
  range: string
  percentage: number
}

export type GenderSplit = {
  label: string
  percentage: number
}

export type DeviceType = {
  device: string
  percentage: number
}

export type GeographyEntry = {
  country: string
  viewers: number
  percentage: number
}

export type OverviewData = {
  views: TimeSeriesPoint[]
  watchTimeHours: TimeSeriesPoint[]
  followers: TimeSeriesPoint[]
  totalViews: number
  totalWatchTimeHours: number
  totalFollowers: number
  viewsChange: number
  watchTimeChange: number
  followersChange: number
}

export type ContentData = {
  topContent: ContentPerformance[]
  impressions: TimeSeriesPoint[]
  ctr: TimeSeriesPoint[]
  avgViewDuration: TimeSeriesPoint[]
  totalImpressions: number
  avgCtr: number
  avgDuration: string
  impressionsChange: number
  ctrChange: number
  durationChange: number
}

export type AudienceData = {
  ageGroups: AgeGroup[]
  genderSplit: GenderSplit[]
  deviceTypes: DeviceType[]
  geography: GeographyEntry[]
}

// ─── Generators ─────────────────────────────────────────────────────────

function generateTimeSeries(
  startDate: string,
  endDate: string,
  baseValue: number,
  variance: number,
): TimeSeriesPoint[] {
  const points: TimeSeriesPoint[] = []
  let current = dayjs(startDate)
  const end = dayjs(endDate)

  while (current.isBefore(end) || current.isSame(end, 'day')) {
    points.push({
      date: current.format('YYYY-MM-DD'),
      value: Math.round(baseValue + (Math.random() - 0.4) * variance),
    })
    current = current.add(1, 'day')
  }
  return points
}

export async function fetchOverviewData(
  startDate: string,
  endDate: string,
): Promise<OverviewData> {
  await new Promise((r) => setTimeout(r, 600))

  const views = generateTimeSeries(startDate, endDate, 1200, 800)
  const watchTimeHours = generateTimeSeries(startDate, endDate, 45, 30)
  const followers = generateTimeSeries(startDate, endDate, 25, 20)

  const totalViews = views.reduce((s, p) => s + p.value, 0)
  const totalWatchTimeHours = watchTimeHours.reduce((s, p) => s + p.value, 0)
  const totalFollowers = followers.reduce((s, p) => s + p.value, 0)

  return {
    views,
    watchTimeHours,
    followers,
    totalViews,
    totalWatchTimeHours,
    totalFollowers,
    viewsChange: +(Math.random() * 30 - 5).toFixed(1),
    watchTimeChange: +(Math.random() * 20 - 3).toFixed(1),
    followersChange: +(Math.random() * 15 - 2).toFixed(1),
  }
}

export async function fetchContentData(
  startDate: string,
  endDate: string,
): Promise<ContentData> {
  await new Promise((r) => setTimeout(r, 600))

  const impressions = generateTimeSeries(startDate, endDate, 5000, 3000)
  const ctr = generateTimeSeries(startDate, endDate, 48, 25) // values = percentage * 10
  const avgViewDuration = generateTimeSeries(startDate, endDate, 320, 120) // values in seconds

  const topContent: ContentPerformance[] = [
    {
      id: 1,
      title: 'How to Build a Design System',
      thumbnail: 'https://picsum.photos/seed/tc1/80/45',
      views: 45200,
      watchTimeHours: 1230,
      impressions: 128000,
      ctr: 5.2,
      avgViewDuration: '5:34',
    },
    {
      id: 2,
      title: 'Advanced React Patterns 2026',
      thumbnail: 'https://picsum.photos/seed/tc2/80/45',
      views: 38700,
      watchTimeHours: 980,
      impressions: 95400,
      ctr: 4.8,
      avgViewDuration: '4:12',
    },
    {
      id: 3,
      title: 'UI Animation Masterclass',
      thumbnail: 'https://picsum.photos/seed/tc3/80/45',
      views: 31500,
      watchTimeHours: 870,
      impressions: 82100,
      ctr: 4.1,
      avgViewDuration: '6:45',
    },
    {
      id: 4,
      title: 'TypeScript Tips & Tricks',
      thumbnail: 'https://picsum.photos/seed/tc4/80/45',
      views: 28900,
      watchTimeHours: 650,
      impressions: 74800,
      ctr: 3.9,
      avgViewDuration: '3:28',
    },
    {
      id: 5,
      title: 'CSS Grid Deep Dive',
      thumbnail: 'https://picsum.photos/seed/tc5/80/45',
      views: 22300,
      watchTimeHours: 520,
      impressions: 61200,
      ctr: 3.5,
      avgViewDuration: '4:56',
    },
  ]

  return {
    topContent,
    impressions,
    ctr,
    avgViewDuration,
    totalImpressions: impressions.reduce((s, p) => s + p.value, 0),
    avgCtr: +(ctr.reduce((s, p) => s + p.value, 0) / ctr.length / 10).toFixed(
      1,
    ),
    avgDuration: '4:35',
    impressionsChange: +(Math.random() * 25 - 5).toFixed(1),
    ctrChange: +(Math.random() * 10 - 3).toFixed(1),
    durationChange: +(Math.random() * 8 - 2).toFixed(1),
  }
}

export async function fetchAudienceData(
  _startDate: string,
  _endDate: string,
): Promise<AudienceData> {
  await new Promise((r) => setTimeout(r, 600))

  return {
    ageGroups: [
      { range: '13-17', percentage: 8 },
      { range: '18-24', percentage: 32 },
      { range: '25-34', percentage: 35 },
      { range: '35-44', percentage: 15 },
      { range: '45-54', percentage: 7 },
      { range: '55+', percentage: 3 },
    ],
    genderSplit: [
      { label: 'Male', percentage: 62 },
      { label: 'Female', percentage: 34 },
      { label: 'Other', percentage: 4 },
    ],
    deviceTypes: [
      { device: 'Mobile', percentage: 58 },
      { device: 'Desktop', percentage: 32 },
      { device: 'Tablet', percentage: 7 },
      { device: 'TV', percentage: 3 },
    ],
    geography: [
      { country: 'United States', viewers: 45200, percentage: 28.5 },
      { country: 'United Kingdom', viewers: 18300, percentage: 11.5 },
      { country: 'Indonesia', viewers: 15600, percentage: 9.8 },
      { country: 'India', viewers: 14200, percentage: 8.9 },
      { country: 'Germany', viewers: 11800, percentage: 7.4 },
      { country: 'Brazil', viewers: 9400, percentage: 5.9 },
      { country: 'Canada', viewers: 8700, percentage: 5.5 },
      { country: 'Japan', viewers: 7200, percentage: 4.5 },
      { country: 'Australia', viewers: 6100, percentage: 3.8 },
      { country: 'France', viewers: 5400, percentage: 3.4 },
    ],
  }
}
