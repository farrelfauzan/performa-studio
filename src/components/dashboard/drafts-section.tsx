import { Link } from '@tanstack/react-router'
import { ArrowRight } from 'lucide-react'
import { useApiQuery } from '@/hooks/use-api'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { STUDIO_PROJECTS, type StudioProject } from '@/lib/dummy-data'

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-500/15 text-yellow-400 border-transparent',
  'in-progress': 'bg-blue-500/15 text-blue-400 border-transparent',
}

async function fetchDrafts(): Promise<StudioProject[]> {
  await new Promise((resolve) => setTimeout(resolve, 650))
  return STUDIO_PROJECTS.filter(
    (p) => p.status === 'draft' || p.status === 'in-progress',
  ).slice(0, 4)
}

function DraftsSkeleton() {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Drafts &amp; In Progress
        </CardTitle>
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

  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <CardTitle className="text-sm font-medium">
          Drafts &amp; In Progress
        </CardTitle>
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
          {data.map((project) => (
            <Link
              key={project.id}
              to="/dashboard/studio/$contentId"
              params={{ contentId: String(project.id) }}
              search={{} as any}
              className="group -m-2 rounded-xl p-2 transition-colors hover:bg-muted/50"
            >
              <div className="relative aspect-video overflow-hidden rounded-lg">
                <img
                  src={project.thumbnail}
                  alt={project.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white/80">
                  {project.duration}
                </span>
              </div>
              <div className="mt-2">
                <p className="truncate text-sm font-medium">{project.title}</p>
                <div className="mt-1 flex items-center gap-2">
                  <Badge
                    className={`px-1.5 py-0.5 text-[10px] capitalize ${STATUS_STYLES[project.status]}`}
                  >
                    {project.status}
                  </Badge>
                  <span className="text-xs text-muted-foreground/60">
                    {project.updatedAt}
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
