import { Link } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { useApiQuery } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MOST_WATCHED_VIDEOS, type MostWatchedVideo } from '@/lib/dummy-data'

function formatViews(n: number) {
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`
  return n.toLocaleString()
}

async function fetchMostWatched(): Promise<MostWatchedVideo[]> {
  await new Promise((resolve) => setTimeout(resolve, 700))
  return MOST_WATCHED_VIDEOS
}

function MostWatchedSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Most Watched</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="flex items-center gap-3">
            <Skeleton className="h-12 w-20 shrink-0 rounded-lg" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-3 w-36" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

export function MostWatchedSection() {
  const { data, isLoading } = useApiQuery(
    'dashboard-most-watched',
    fetchMostWatched,
  )

  if (isLoading || !data) {
    return <MostWatchedSkeleton />
  }

  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">Most Watched</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {data.map((video) => (
          <Link
            key={video.id}
            to="/dashboard/studio/$contentId"
            params={{ contentId: String(video.id) }}
            search={{} as any}
            className="-m-1.5 flex items-center gap-3 rounded-lg p-1.5 transition-colors hover:bg-muted/50"
          >
            <div className="relative h-12 w-20 shrink-0 overflow-hidden rounded-lg">
              <img
                src={video.thumbnail}
                alt={video.title}
                className="h-full w-full object-cover"
              />
              <span className="absolute bottom-0.5 right-0.5 rounded bg-black/70 px-1 text-[10px] text-white/80">
                {video.duration}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{video.title}</p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <Eye className="size-3" />
                {formatViews(video.views)} views
              </p>
            </div>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
