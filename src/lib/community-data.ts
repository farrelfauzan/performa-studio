// ─── Community Types ────────────────────────────────────────────────────

export type CommunityComment = {
  id: number
  author: string
  avatar: string
  content: string
  contentTitle: string
  timestamp: string
  likes: number
  dislikes: number
  loved: boolean
  replies: CommunityReply[]
}

export type CommunityReply = {
  id: number
  author: string
  avatar: string
  content: string
  timestamp: string
  isCreator: boolean
}

export type CommunityStats = {
  totalComments: number
  totalCommentsChange: number
  monthlyAudience: number
  monthlyAudienceChange: number
}

export type SubscriptionTierFeatures = {
  adFree: boolean
  badge: boolean
  earlyAccess: boolean
  directMessage: boolean
}

export type ApprovalStatus = 'pending' | 'approved' | 'rejected'

export type SubscriptionTier = {
  id: number
  name: string
  price: number
  description: string
  features: SubscriptionTierFeatures
  memberCount: number
  approvalStatus: ApprovalStatus
}

// ─── Community Dummy Data ───────────────────────────────────────────────

export const COMMUNITY_STATS: CommunityStats = {
  totalComments: 12_847,
  totalCommentsChange: 14.2,
  monthlyAudience: 48_320,
  monthlyAudienceChange: 8.7,
}

export const SUBSCRIPTION_TIERS: SubscriptionTier[] = [
  {
    id: 1,
    name: 'Free',
    price: 0,
    description: 'Access basic content and join the community.',
    features: {
      adFree: false,
      badge: false,
      earlyAccess: false,
      directMessage: false,
    },
    memberCount: 42_150,
    approvalStatus: 'approved',
  },
  {
    id: 2,
    name: 'Supporter',
    price: 4.99,
    description: 'Support the channel and unlock extra perks.',
    features: {
      adFree: true,
      badge: true,
      earlyAccess: true,
      directMessage: false,
    },
    memberCount: 3_820,
    approvalStatus: 'approved',
  },
  {
    id: 3,
    name: 'VIP',
    price: 14.99,
    description: 'Get the ultimate fan experience with all perks.',
    features: {
      adFree: true,
      badge: true,
      earlyAccess: true,
      directMessage: true,
    },
    memberCount: 1_250,
    approvalStatus: 'approved',
  },
]

export const COMMUNITY_COMMENTS: CommunityComment[] = [
  {
    id: 1,
    author: 'Alex Rivera',
    avatar: 'https://picsum.photos/seed/user1/40/40',
    content:
      'This design system tutorial was exactly what I needed. The component architecture section was especially helpful!',
    contentTitle: 'How to Build a Design System',
    timestamp: '2 hours ago',
    likes: 24,
    dislikes: 1,
    loved: true,
    replies: [
      {
        id: 101,
        author: 'Performa',
        avatar: 'https://picsum.photos/seed/creator/40/40',
        content:
          "Thanks Alex! Glad it helped. I'll be covering more advanced patterns in the next video.",
        timestamp: '1 hour ago',
        isCreator: true,
      },
    ],
  },
  {
    id: 2,
    author: 'Sarah Chen',
    avatar: 'https://picsum.photos/seed/user2/40/40',
    content:
      'The React patterns video was mind-blowing. I refactored my entire app using the compound component pattern. Would love a follow-up on render props vs hooks!',
    contentTitle: 'Advanced React Patterns 2026',
    timestamp: '5 hours ago',
    likes: 42,
    dislikes: 0,
    loved: false,
    replies: [],
  },
  {
    id: 3,
    author: 'Marcus Johnson',
    avatar: 'https://picsum.photos/seed/user3/40/40',
    content:
      'Great animation examples! Can you share the Figma files for the UI used in the demo?',
    contentTitle: 'UI Animation Masterclass',
    timestamp: '1 day ago',
    likes: 18,
    dislikes: 2,
    loved: false,
    replies: [
      {
        id: 102,
        author: 'Performa',
        avatar: 'https://picsum.photos/seed/creator/40/40',
        content: "I'll add them to the description. Check back in a few hours!",
        timestamp: '22 hours ago',
        isCreator: true,
      },
      {
        id: 103,
        author: 'Marcus Johnson',
        avatar: 'https://picsum.photos/seed/user3/40/40',
        content: 'Awesome, thanks for the quick response!',
        timestamp: '20 hours ago',
        isCreator: false,
      },
    ],
  },
  {
    id: 4,
    author: 'Emma Williams',
    avatar: 'https://picsum.photos/seed/user4/40/40',
    content:
      "TypeScript tips video was solid. Tip #3 about discriminated unions saved me hours of debugging. Keep 'em coming!",
    contentTitle: 'TypeScript Tips & Tricks',
    timestamp: '2 days ago',
    likes: 56,
    dislikes: 1,
    loved: true,
    replies: [],
  },
  {
    id: 5,
    author: 'David Kim',
    avatar: 'https://picsum.photos/seed/user5/40/40',
    content:
      'I wish you had covered CSS subgrid in the deep dive. Any plans for a part 2?',
    contentTitle: 'CSS Grid Deep Dive',
    timestamp: '3 days ago',
    likes: 31,
    dislikes: 0,
    loved: false,
    replies: [],
  },
  {
    id: 6,
    author: 'Priya Patel',
    avatar: 'https://picsum.photos/seed/user6/40/40',
    content:
      'The pacing on this one was perfect. Not too fast, not too slow. Subscribed!',
    contentTitle: 'How to Build a Design System',
    timestamp: '3 days ago',
    likes: 15,
    dislikes: 0,
    loved: false,
    replies: [],
  },
  {
    id: 7,
    author: 'James Taylor',
    avatar: 'https://picsum.photos/seed/user7/40/40',
    content:
      'Can you do a video comparing Framer Motion vs View Transitions API? Would love to see the pros/cons.',
    contentTitle: 'UI Animation Masterclass',
    timestamp: '4 days ago',
    likes: 73,
    dislikes: 3,
    loved: true,
    replies: [
      {
        id: 104,
        author: 'Performa',
        avatar: 'https://picsum.photos/seed/creator/40/40',
        content:
          "That's a great idea! Adding it to the content calendar. Stay tuned 🎬",
        timestamp: '4 days ago',
        isCreator: true,
      },
    ],
  },
  {
    id: 8,
    author: 'Lisa Nakamura',
    avatar: 'https://picsum.photos/seed/user8/40/40',
    content:
      "First time watching your channel and I'm hooked. The production quality is insane for a tech channel!",
    contentTitle: 'Advanced React Patterns 2026',
    timestamp: '5 days ago',
    likes: 29,
    dislikes: 0,
    loved: true,
    replies: [],
  },
]

// ─── Fetch Functions ────────────────────────────────────────────────────

export async function fetchCommunityStats(): Promise<CommunityStats> {
  await new Promise((r) => setTimeout(r, 500))
  return COMMUNITY_STATS
}

export async function fetchCommunityComments(): Promise<CommunityComment[]> {
  await new Promise((r) => setTimeout(r, 700))
  return COMMUNITY_COMMENTS
}

export async function fetchSubscriptionTiers(): Promise<SubscriptionTier[]> {
  await new Promise((r) => setTimeout(r, 600))
  return SUBSCRIPTION_TIERS
}

export function getFeatureLabels(features: SubscriptionTierFeatures): string[] {
  const labels: string[] = ['Basic community access']
  if (features.adFree) labels.push('Ad-free viewing')
  if (features.badge) labels.push('Exclusive badge')
  if (features.earlyAccess) labels.push('Early access to content')
  if (features.directMessage) labels.push('Direct messaging')
  return labels
}

export async function submitSubscriptionTiers(
  tiers: Omit<SubscriptionTier, 'id' | 'memberCount' | 'approvalStatus'>[],
): Promise<SubscriptionTier[]> {
  await new Promise((r) => setTimeout(r, 1000))
  return tiers.map((tier, i) => ({
    ...tier,
    id: i + 1,
    memberCount: 0,
    approvalStatus: 'pending' as const,
  }))
}

export async function updateSubscriptionTiers(
  tiers: SubscriptionTier[],
): Promise<SubscriptionTier[]> {
  await new Promise((r) => setTimeout(r, 1000))
  return tiers.map((t) => ({ ...t, approvalStatus: 'pending' as const }))
}
