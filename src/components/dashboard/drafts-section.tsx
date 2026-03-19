import { Link } from '@tanstack/react-router'
import { ArrowRight, Plus } from 'lucide-react'
import { useApiQuery } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { contentApi } from '@/lib/api'
import { ContentStatus, type Content } from '@/lib/types'
import { getContentStatusLabel } from '@/hooks/use-studio'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-500/15 text-yellow-400 border-transparent',
}

async function fetchDrafts(): Promise<Content[]> {
  const res = await contentApi.getAll({ page: 1, pageSize: 4 })
  const items = res?.data ?? []
  return items.filter((c: Content) => c.status === ContentStatus.DRAFT)
}

function DraftsSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="aspect-video w-full rounded-lg" />
              <Skeleton className="h-3 w-28" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-16 rounded-full" />
                <Skeleton className="h-2.5 w-16" />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function DraftsSection() {
  const { data, isLoading } = useApiQuery('dashboard-drafts', fetchDrafts)

  if (isLoading || !data) {
    return <DraftsSkeleton />
  }

  if (data.length === 0) {
    return (
      <Card size="sm" className="bg-card/50 backdrop-blur-xl">
        <CardHeader>
          <CardTitle className="text-sm font-medium">Drafts</CardTitle>
          <CardAction>
            <Button variant="outline" size="sm" asChild>
              <Link to="/dashboard/studio/create">
                <Plus className="size-3" /> Create content
              </Link>
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <p className="py-6 text-center text-sm text-muted-foreground">
            No drafts yet
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Drafts</CardTitle>
        <CardAction>
          <Link
            to="/dashboard/studio"
            search={{} as any}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View all <ArrowRight className="size-3" />
          </Link>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {data.map((content) => (
            <Link
              key={content.id}
              to="/dashboard/studio/$contentId"
              params={{ contentId: String(content.id) }}
              search={{} as any}
              className="group -m-2 rounded-xl p-2 transition-colors hover:bg-muted/50"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg">
                {content.thumbnailUrl ? (
                  <img
                    src={content.thumbnailUrl}
                    alt={content.title}
                    className="h-full w-full object-cover transition-transform group-hover:scale-105"
                  />
                ) : (
                  <div className="h-full w-full bg-white/5" />
                )}
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-medium">{content.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    className={`px-1.5 py-0.5 text-[10px] capitalize ${STATUS_STYLES[getContentStatusLabel(content.status)] ?? ''}`}
                  >
                    {getContentStatusLabel(content.status)}
                  </Badge>
                  <span className="text-xs text-muted-foreground/60">
                    {new Date(content.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
