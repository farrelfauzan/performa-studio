// ─── Types ──────────────────────────────────────────────────────────────

export type DashboardStat = {
  label: string
  value: string
}

export type ActivityItem = {
  id: number
  action: string
  target: string
  time: string
}

export type StudioProject = {
  id: number
  title: string
  status: 'draft' | 'in-progress' | 'published'
  updatedAt: string
  thumbnail: string
  duration: string
}

// ─── Dashboard data ─────────────────────────────────────────────────────

export const DASHBOARD_STATS: DashboardStat[] = [
  { label: 'Total Projects', value: '12' },
  { label: 'Active Sessions', value: '3' },
  { label: 'Storage Used', value: '2.4 GB' },
]

export const DASHBOARD_ACTIVITY: ActivityItem[] = [
  {
    id: 1,
    action: 'Created project',
    target: 'Brand Refresh 2026',
    time: '2 hours ago',
  },
  {
    id: 2,
    action: 'Edited scene',
    target: 'Product Launch Video',
    time: '5 hours ago',
  },
  {
    id: 3,
    action: 'Exported render',
    target: 'Social Media Kit',
    time: '1 day ago',
  },
  {
    id: 4,
    action: 'Shared project',
    target: 'Q1 Campaign Assets',
    time: '2 days ago',
  },
  {
    id: 5,
    action: 'Uploaded media',
    target: 'Client Footage Pack',
    time: '3 days ago',
  },
]

// ─── Studio data ────────────────────────────────────────────────────────

export const STUDIO_PROJECTS: StudioProject[] = [
  {
    id: 1,
    title: 'Brand Refresh 2026',
    status: 'in-progress',
    updatedAt: '2 hours ago',
    thumbnail: 'https://picsum.photos/seed/proj1/400/300',
    duration: '2:34',
  },
  {
    id: 2,
    title: 'Product Launch Video',
    status: 'draft',
    updatedAt: '5 hours ago',
    thumbnail: 'https://picsum.photos/seed/proj2/400/300',
    duration: '1:12',
  },
  {
    id: 3,
    title: 'Social Media Kit',
    status: 'published',
    updatedAt: '1 day ago',
    thumbnail: 'https://picsum.photos/seed/proj3/400/300',
    duration: '0:45',
  },
  {
    id: 4,
    title: 'Q1 Campaign Assets',
    status: 'published',
    updatedAt: '2 days ago',
    thumbnail: 'https://picsum.photos/seed/proj4/400/300',
    duration: '3:20',
  },
  {
    id: 5,
    title: 'Client Footage Pack',
    status: 'in-progress',
    updatedAt: '3 days ago',
    thumbnail: 'https://picsum.photos/seed/proj5/400/300',
    duration: '5:10',
  },
  {
    id: 6,
    title: 'Onboarding Tutorial',
    status: 'draft',
    updatedAt: '4 days ago',
    thumbnail: 'https://picsum.photos/seed/proj6/400/300',
    duration: '4:05',
  },
  {
    id: 7,
    title: 'Holiday Promo Reel',
    status: 'published',
    updatedAt: '4 days ago',
    thumbnail: 'https://picsum.photos/seed/proj7/400/300',
    duration: '1:50',
  },
  {
    id: 8,
    title: 'Investor Pitch Deck',
    status: 'in-progress',
    updatedAt: '5 days ago',
    thumbnail: 'https://picsum.photos/seed/proj8/400/300',
    duration: '6:15',
  },
  {
    id: 9,
    title: 'App Store Preview',
    status: 'draft',
    updatedAt: '5 days ago',
    thumbnail: 'https://picsum.photos/seed/proj9/400/300',
    duration: '0:30',
  },
  {
    id: 10,
    title: 'Team Intro Video',
    status: 'published',
    updatedAt: '6 days ago',
    thumbnail: 'https://picsum.photos/seed/proj10/400/300',
    duration: '3:45',
  },
  {
    id: 11,
    title: 'Feature Walkthrough',
    status: 'in-progress',
    updatedAt: '1 week ago',
    thumbnail: 'https://picsum.photos/seed/proj11/400/300',
    duration: '7:20',
  },
  {
    id: 12,
    title: 'Customer Testimonials',
    status: 'published',
    updatedAt: '1 week ago',
    thumbnail: 'https://picsum.photos/seed/proj12/400/300',
    duration: '4:50',
  },
  {
    id: 13,
    title: 'Annual Report Animation',
    status: 'draft',
    updatedAt: '1 week ago',
    thumbnail: 'https://picsum.photos/seed/proj13/400/300',
    duration: '2:10',
  },
  {
    id: 14,
    title: 'Explainer Series Ep.1',
    status: 'published',
    updatedAt: '8 days ago',
    thumbnail: 'https://picsum.photos/seed/proj14/400/300',
    duration: '3:00',
  },
  {
    id: 15,
    title: 'Explainer Series Ep.2',
    status: 'in-progress',
    updatedAt: '9 days ago',
    thumbnail: 'https://picsum.photos/seed/proj15/400/300',
    duration: '2:55',
  },
  {
    id: 16,
    title: 'Explainer Series Ep.3',
    status: 'draft',
    updatedAt: '9 days ago',
    thumbnail: 'https://picsum.photos/seed/proj16/400/300',
    duration: '3:10',
  },
  {
    id: 17,
    title: 'Brand Guidelines Video',
    status: 'published',
    updatedAt: '10 days ago',
    thumbnail: 'https://picsum.photos/seed/proj17/400/300',
    duration: '5:30',
  },
  {
    id: 18,
    title: 'Event Recap Highlight',
    status: 'published',
    updatedAt: '11 days ago',
    thumbnail: 'https://picsum.photos/seed/proj18/400/300',
    duration: '1:40',
  },
  {
    id: 19,
    title: 'Podcast Teaser Clips',
    status: 'in-progress',
    updatedAt: '12 days ago',
    thumbnail: 'https://picsum.photos/seed/proj19/400/300',
    duration: '0:55',
  },
  {
    id: 20,
    title: 'Newsletter Banner Set',
    status: 'draft',
    updatedAt: '12 days ago',
    thumbnail: 'https://picsum.photos/seed/proj20/400/300',
    duration: '1:05',
  },
  {
    id: 21,
    title: 'Landing Page Hero',
    status: 'published',
    updatedAt: '2 weeks ago',
    thumbnail: 'https://picsum.photos/seed/proj21/400/300',
    duration: '0:20',
  },
  {
    id: 22,
    title: 'Sales Demo Recording',
    status: 'in-progress',
    updatedAt: '2 weeks ago',
    thumbnail: 'https://picsum.photos/seed/proj22/400/300',
    duration: '8:45',
  },
  {
    id: 23,
    title: 'Webinar Intro Bumper',
    status: 'published',
    updatedAt: '2 weeks ago',
    thumbnail: 'https://picsum.photos/seed/proj23/400/300',
    duration: '0:15',
  },
  {
    id: 24,
    title: 'Product Comparison Ad',
    status: 'draft',
    updatedAt: '15 days ago',
    thumbnail: 'https://picsum.photos/seed/proj24/400/300',
    duration: '0:35',
  },
  {
    id: 25,
    title: 'Recruitment Video',
    status: 'in-progress',
    updatedAt: '16 days ago',
    thumbnail: 'https://picsum.photos/seed/proj25/400/300',
    duration: '2:20',
  },
  {
    id: 26,
    title: 'Partner Spotlight',
    status: 'published',
    updatedAt: '17 days ago',
    thumbnail: 'https://picsum.photos/seed/proj26/400/300',
    duration: '3:15',
  },
  {
    id: 27,
    title: 'Year in Review 2025',
    status: 'published',
    updatedAt: '18 days ago',
    thumbnail: 'https://picsum.photos/seed/proj27/400/300',
    duration: '4:30',
  },
  {
    id: 28,
    title: 'Behind the Scenes',
    status: 'draft',
    updatedAt: '19 days ago',
    thumbnail: 'https://picsum.photos/seed/proj28/400/300',
    duration: '6:00',
  },
  {
    id: 29,
    title: 'Instagram Story Pack',
    status: 'in-progress',
    updatedAt: '20 days ago',
    thumbnail: 'https://picsum.photos/seed/proj29/400/300',
    duration: '0:25',
  },
  {
    id: 30,
    title: 'TikTok Ad Variants',
    status: 'published',
    updatedAt: '3 weeks ago',
    thumbnail: 'https://picsum.photos/seed/proj30/400/300',
    duration: '0:18',
  },
  {
    id: 31,
    title: 'CEO Keynote Edit',
    status: 'in-progress',
    updatedAt: '3 weeks ago',
    thumbnail: 'https://picsum.photos/seed/proj31/400/300',
    duration: '12:30',
  },
  {
    id: 32,
    title: 'Animated Logo Reveal',
    status: 'published',
    updatedAt: '22 days ago',
    thumbnail: 'https://picsum.photos/seed/proj32/400/300',
    duration: '0:10',
  },
  {
    id: 33,
    title: 'Help Center Tutorials',
    status: 'draft',
    updatedAt: '23 days ago',
    thumbnail: 'https://picsum.photos/seed/proj33/400/300',
    duration: '9:15',
  },
  {
    id: 34,
    title: 'Conference Booth Loop',
    status: 'published',
    updatedAt: '24 days ago',
    thumbnail: 'https://picsum.photos/seed/proj34/400/300',
    duration: '1:00',
  },
  {
    id: 35,
    title: 'Mobile App Promo',
    status: 'in-progress',
    updatedAt: '25 days ago',
    thumbnail: 'https://picsum.photos/seed/proj35/400/300',
    duration: '0:40',
  },
  {
    id: 36,
    title: 'YouTube Channel Trailer',
    status: 'draft',
    updatedAt: '26 days ago',
    thumbnail: 'https://picsum.photos/seed/proj36/400/300',
    duration: '1:30',
  },
  {
    id: 37,
    title: 'Case Study Animation',
    status: 'published',
    updatedAt: '27 days ago',
    thumbnail: 'https://picsum.photos/seed/proj37/400/300',
    duration: '3:50',
  },
  {
    id: 38,
    title: 'Internal Training Clips',
    status: 'in-progress',
    updatedAt: '28 days ago',
    thumbnail: 'https://picsum.photos/seed/proj38/400/300',
    duration: '10:05',
  },
  {
    id: 39,
    title: 'Charity Gala Montage',
    status: 'draft',
    updatedAt: '29 days ago',
    thumbnail: 'https://picsum.photos/seed/proj39/400/300',
    duration: '2:45',
  },
  {
    id: 40,
    title: 'Product Unboxing Reel',
    status: 'published',
    updatedAt: '1 month ago',
    thumbnail: 'https://picsum.photos/seed/proj40/400/300',
    duration: '1:55',
  },
]

// ─── Mock fetch functions (simulate network delay) ──────────────────────

export async function fetchDashboardData() {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { stats: DASHBOARD_STATS, activity: DASHBOARD_ACTIVITY }
}

export async function fetchStudioData() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { projects: STUDIO_PROJECTS }
}
