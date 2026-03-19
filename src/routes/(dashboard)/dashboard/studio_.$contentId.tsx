import { useState } from 'react'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Pencil,
  EyeOff,
  Eye,
  ChevronDown,
  ChevronUp,
  Play,
  Calendar,
  Tag,
  Layers,
  Video,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { contentApi } from '@/lib/api'
import { ContentStatus } from '@/lib/types'
import { getContentStatusLabel } from '@/hooks/use-studio'

// ─── Route ──────────────────────────────────────────────────────────────

export const Route = createFileRoute(
  '/(dashboard)/dashboard/studio_/$contentId',
)({
  loader: async ({ params }) => {
    const result = await contentApi.getById(params.contentId)
    return result.data
  },
  component: ContentDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    view: (search.view === 'list' ? 'list' : 'grid') as 'grid' | 'list',
    page: Number(search.page) || 0,
    q: typeof search.q === 'string' ? search.q : '',
  }),
})

// ─── Status styles ──────────────────────────────────────────────────────

const STATUS_STYLES: Record<string, string> = {
  draft: 'bg-yellow-500/15 text-yellow-400',
  published: 'bg-green-500/15 text-green-400',
  archived: 'bg-gray-500/15 text-gray-400',
}

// ─── Page Component ─────────────────────────────────────────────────────

function ContentDetailPage() {
  const { content } = Route.useLoaderData()
  const navigate = useNavigate()
  const { view, page, q } = Route.useSearch()
  const sections = content?.sections ?? []
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    return new Set(sections.map((s) => s.id))
  })

  if (!content) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <p className="text-lg font-medium text-white/60">Content not found</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() =>
            navigate({
              to: '/dashboard/studio',
              search: { view, page, q },
            })
          }
        >
          Back to Studio
        </Button>
      </div>
    )
  }

  const statusLabel = getContentStatusLabel(content.status)

  const totalVideos = sections.reduce(
    (sum, s) => sum + (s.medias?.length ?? 0),
    0,
  )

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const handleTogglePublish = async () => {
    try {
      const newStatus =
        content.status === ContentStatus.PUBLISHED
          ? ContentStatus.DRAFT
          : ContentStatus.PUBLISHED
      await contentApi.update(content.id, { status: newStatus })
      if (newStatus === ContentStatus.PUBLISHED) {
        toast.success(`"${content.title}" has been published`)
      } else {
        toast.success(`"${content.title}" has been unpublished`)
      }
    } catch {
      toast.error('Failed to update content status')
    }
  }

  const handleEdit = () => {
    toast.info('Edit mode coming soon')
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() =>
            navigate({
              to: '/dashboard/studio',
              search: { view, page, q },
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h1 className="truncate text-2xl font-bold text-white">
              {content.title}
            </h1>
            <Badge
              className={`shrink-0 text-[12px] capitalize py-3 ${STATUS_STYLES[statusLabel] ?? STATUS_STYLES.draft}`}
            >
              {statusLabel}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-white/50">{content.body}</p>
        </div>
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-2">
        <Button size="sm" variant="outline" onClick={handleEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <Button size="sm" variant="outline" onClick={handleTogglePublish}>
          {content.status === ContentStatus.PUBLISHED ? (
            <>
              <EyeOff className="h-3.5 w-3.5" />
              Unpublish
            </>
          ) : (
            <>
              <Eye className="h-3.5 w-3.5" />
              Publish
            </>
          )}
        </Button>
      </div>

      {/* Content overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left: Thumbnail & meta */}
        <div className="space-y-4">
          <Card className="bg-white/5 backdrop-blur-xl ring-white/12 overflow-hidden">
            {content.thumbnailUrl ? (
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="h-48 w-full object-cover"
              />
            ) : (
              <div className="h-48 w-full bg-white/5" />
            )}
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Created{' '}
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>
              {content.year && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <Tag className="h-3.5 w-3.5" />
                  <span>{content.year}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Layers className="h-3.5 w-3.5" />
                <span>
                  {sections.length}{' '}
                  {sections.length === 1 ? 'section' : 'sections'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Video className="h-3.5 w-3.5" />
                <span>
                  {totalVideos} {totalVideos === 1 ? 'video' : 'videos'}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Sections & lessons */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">
              Learning Sections
            </h2>
            <span className="text-xs text-white/30">
              {sections.length}{' '}
              {sections.length === 1 ? 'section' : 'sections'} &middot;{' '}
              {totalVideos} {totalVideos === 1 ? 'video' : 'videos'}
            </span>
          </div>

          {sections.length === 0 && (
            <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
              <CardContent>
                <p className="py-8 text-center text-sm text-white/40">
                  No sections yet
                </p>
              </CardContent>
            </Card>
          )}

          <div className="space-y-3">
            {sections.map((section, sIdx) => {
              const isOpen = openSections.has(section.id)
              const medias = section.medias ?? []

              return (
                <div
                  key={section.id}
                  className="rounded-xl border border-white/12 bg-white/3 overflow-hidden"
                >
                  {/* Section header */}
                  <button
                    type="button"
                    onClick={() => toggleSection(section.id)}
                    className="flex w-full items-center gap-3 px-4 py-3 bg-white/2 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs font-medium text-white/60">
                      {sIdx + 1}
                    </span>
                    <div className="min-w-0 flex-1">
                      <span className="text-sm font-medium text-white/80">
                        {section.title}
                      </span>
                      {section.description && (
                        <p className="mt-0.5 text-xs text-white/30">
                          {section.description}
                        </p>
                      )}
                    </div>
                    <span className="text-xs text-white/30">
                      {medias.length}{' '}
                      {medias.length === 1 ? 'video' : 'videos'}
                    </span>
                    {isOpen ? (
                      <ChevronUp className="h-4 w-4 text-white/30" />
                    ) : (
                      <ChevronDown className="h-4 w-4 text-white/30" />
                    )}
                  </button>

                  {/* Videos list */}
                  {isOpen && (
                    <div className="divide-y divide-white/6">
                      {medias.map((m, vIdx) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/3"
                        >
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/8">
                            <Play className="h-3 w-3 text-white/50" />
                          </div>
                          <span className="text-xs text-white/30 w-5">
                            {vIdx + 1}.
                          </span>
                          <span className="flex-1 text-sm text-white/70">
                            {m.title ?? m.fileName}
                          </span>
                          <span className="text-xs text-white/30">
                            {m.hlsUrl ? 'Ready' : 'Processing'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
