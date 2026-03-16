// ─── Types ──────────────────────────────────────────────────────────────

export type DashboardStat = {
  label: string
  value: string
  change?: number
}

export type ActivityItem = {
  id: number
  action: string
  target: string
  time: string
}

export type MostWatchedVideo = {
  id: number
  title: string
  thumbnail: string
  views: number
  duration: string
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
  { label: 'Total Projects', value: '12', change: 8.2 },
  { label: 'Total Followers', value: '4,832', change: 12.5 },
  { label: 'Total Views', value: '128.4K', change: -3.1 },
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

export const MOST_WATCHED_VIDEOS: MostWatchedVideo[] = [
  {
    id: 1,
    title: 'How to Build a Design System',
    thumbnail: 'https://picsum.photos/seed/mw1/400/225',
    views: 45200,
    duration: '12:34',
  },
  {
    id: 2,
    title: 'Advanced React Patterns 2026',
    thumbnail: 'https://picsum.photos/seed/mw2/400/225',
    views: 38700,
    duration: '18:22',
  },
  {
    id: 3,
    title: 'UI Animation Masterclass',
    thumbnail: 'https://picsum.photos/seed/mw3/400/225',
    views: 31500,
    duration: '24:15',
  },
  {
    id: 4,
    title: 'TypeScript Tips & Tricks',
    thumbnail: 'https://picsum.photos/seed/mw4/400/225',
    views: 28900,
    duration: '9:45',
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

// ─── Content Detail types & data ────────────────────────────────────────

export type ContentVideo = {
  id: string
  title: string
  duration: string
}

export type ContentSection = {
  id: string
  title: string
  description: string
  videos: ContentVideo[]
}

export type ContentDetail = {
  id: number
  title: string
  year: string
  category: string
  description: string
  status: 'draft' | 'in-progress' | 'published'
  thumbnail: string
  previewVideo: string
  duration: string
  updatedAt: string
  createdAt: string
  sections: ContentSection[]
}

export const CONTENT_DETAILS: Record<number, ContentDetail> = {
  1: {
    id: 1,
    title: 'Brand Refresh 2026',
    year: '2026',
    category: 'design',
    description:
      'A comprehensive redesign of brand assets including logo, typography, and color palette guidelines for the 2026 refresh.',
    status: 'in-progress',
    thumbnail: 'https://picsum.photos/seed/proj1/400/300',
    previewVideo: '',
    duration: '2:34',
    updatedAt: '2 hours ago',
    createdAt: 'Mar 14, 2026',
    sections: [
      {
        id: 's1',
        title: 'Introduction to Brand Identity',
        description: 'Overview of the refreshed brand direction',
        videos: [
          { id: 'v1', title: 'Welcome & Overview', duration: '1:20' },
          { id: 'v2', title: 'Brand Vision 2026', duration: '0:45' },
        ],
      },
      {
        id: 's2',
        title: 'Logo & Typography',
        description: 'Deep dive into new logo variants and type system',
        videos: [
          { id: 'v3', title: 'Logo Redesign Process', duration: '0:29' },
        ],
      },
    ],
  },
  2: {
    id: 2,
    title: 'Product Launch Video',
    year: '2026',
    category: 'marketing',
    description:
      'Launch campaign video for the upcoming product release targeting enterprise customers.',
    status: 'draft',
    thumbnail: 'https://picsum.photos/seed/proj2/400/300',
    previewVideo: '',
    duration: '1:12',
    updatedAt: '5 hours ago',
    createdAt: 'Mar 13, 2026',
    sections: [
      {
        id: 's1',
        title: 'Product Overview',
        description: 'What the product does and why it matters',
        videos: [
          { id: 'v1', title: 'Feature Highlights', duration: '0:40' },
          { id: 'v2', title: 'Key Benefits', duration: '0:32' },
        ],
      },
    ],
  },
  3: {
    id: 3,
    title: 'Social Media Kit',
    year: '2026',
    category: 'marketing',
    description:
      'A ready-to-use kit with video assets optimized for Instagram, TikTok, and LinkedIn.',
    status: 'published',
    thumbnail: 'https://picsum.photos/seed/proj3/400/300',
    previewVideo: '',
    duration: '0:45',
    updatedAt: '1 day ago',
    createdAt: 'Mar 10, 2026',
    sections: [
      {
        id: 's1',
        title: 'Instagram Formats',
        description: 'Reels, stories, and feed post videos',
        videos: [
          { id: 'v1', title: 'Reel Templates', duration: '0:15' },
          { id: 'v2', title: 'Story Templates', duration: '0:10' },
          { id: 'v3', title: 'Feed Post Guide', duration: '0:20' },
        ],
      },
      {
        id: 's2',
        title: 'LinkedIn & TikTok',
        description: 'Professional and short-form content formats',
        videos: [
          { id: 'v4', title: 'LinkedIn Video Tips', duration: '0:12' },
          { id: 'v5', title: 'TikTok Cuts', duration: '0:08' },
        ],
      },
    ],
  },
  4: {
    id: 4,
    title: 'Q1 Campaign Assets',
    year: '2026',
    category: 'marketing',
    description:
      'Full campaign asset set for Q1 including ad creatives, landing page videos, and email banners.',
    status: 'published',
    thumbnail: 'https://picsum.photos/seed/proj4/400/300',
    previewVideo: '',
    duration: '3:20',
    updatedAt: '2 days ago',
    createdAt: 'Mar 5, 2026',
    sections: [
      {
        id: 's1',
        title: 'Ad Creatives',
        description: 'Video ads for different platforms',
        videos: [
          { id: 'v1', title: 'Google Ads - 15s', duration: '0:15' },
          { id: 'v2', title: 'Meta Ads - 30s', duration: '0:30' },
          { id: 'v3', title: 'YouTube Pre-roll', duration: '0:20' },
        ],
      },
      {
        id: 's2',
        title: 'Landing Page',
        description: 'Hero video and product demo clips',
        videos: [
          { id: 'v4', title: 'Hero Background Loop', duration: '0:25' },
          { id: 'v5', title: 'Product Demo', duration: '1:30' },
        ],
      },
      {
        id: 's3',
        title: 'Email Assets',
        description: 'Animated GIFs and short clips for email campaigns',
        videos: [
          { id: 'v6', title: 'Email Header Animation', duration: '0:10' },
          { id: 'v7', title: 'CTA Button Animation', duration: '0:10' },
        ],
      },
    ],
  },
}

// Generate fallback detail for projects without explicit detail data
export function getContentDetail(id: number): ContentDetail | null {
  if (CONTENT_DETAILS[id]) return CONTENT_DETAILS[id]

  const project = STUDIO_PROJECTS.find((p) => p.id === id)
  if (!project) return null

  return {
    id: project.id,
    title: project.title,
    year: '2026',
    category: 'development',
    description: `Detailed content for "${project.title}". This project is currently ${project.status}.`,
    status: project.status,
    thumbnail: project.thumbnail,
    previewVideo: '',
    duration: project.duration,
    updatedAt: project.updatedAt,
    createdAt: '2026',
    sections: [
      {
        id: 's1',
        title: 'Getting Started',
        description: 'Introduction and setup',
        videos: [
          { id: 'v1', title: 'Introduction', duration: '1:00' },
          { id: 'v2', title: 'Setup Guide', duration: '0:45' },
        ],
      },
    ],
  }
}

// ─── Mock fetch functions (simulate network delay) ──────────────────────

export async function fetchDashboardData() {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return { stats: DASHBOARD_STATS, activity: DASHBOARD_ACTIVITY }
}

export async function fetchStudioData() {
  await new Promise((resolve) => setTimeout(resolve, 1000))
  return { projects: STUDIO_PROJECTS }
}

export async function fetchContentDetail(
  id: number,
): Promise<ContentDetail | null> {
  await new Promise((resolve) => setTimeout(resolve, 800))
  return getContentDetail(id)
}
