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
  FileText,
  Download,
  Users,
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { contentApi } from '@/lib/api'
import { ContentStatus } from '@/lib/types'
import type { ContentMedia } from '@/lib/types'
import { getContentStatusLabel } from '@/hooks/use-studio'
import { VideoPlayer } from '@/components/video-player'
import { useContentDetail } from '@/hooks/use-content-detail'
import { AssignContentFromDetailSheet } from '@/components/students/assign-content-from-detail-sheet'
import { useContentAssignments } from '@/hooks/use-assignments'

// ─── Route ──────────────────────────────────────────────────────────────

export const Route = createFileRoute(
  '/(dashboard)/dashboard/studio_/$contentId',
)({
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
  const { contentId } = Route.useParams()
  const navigate = useNavigate()
  const { view, page, q } = Route.useSearch()

  const { data, isLoading } = useContentDetail(contentId)

  const content = data?.content ?? null
  const sections = content?.sections ?? []
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    return new Set(sections.map((s) => s.id))
  })
  const [activeTab, setActiveTab] = useState<'sections' | 'documents'>(
    'sections',
  )
  const [playingVideo, setPlayingVideo] = useState<ContentMedia | null>(null)
  const [assignSheetOpen, setAssignSheetOpen] = useState(false)
  const { data: assignedData } = useContentAssignments(contentId)

  const toggleSection = (id: string) => {
    setOpenSections((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

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
    (sum, s) => sum + (s.medias?.filter((m) => m.mediaType !== 2).length ?? 0),
    0,
  )

  const totalDocuments = sections.reduce(
    (sum, s) => sum + (s.medias?.filter((m) => m.mediaType === 2).length ?? 0),
    0,
  )

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
        <Button
          size="sm"
          variant="outline"
          onClick={() => setAssignSheetOpen(true)}
        >
          <Users className="h-3.5 w-3.5" />
          Assign to Students
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
        {/* Left: Thumbnail, preview & meta */}
        <div className="space-y-4">
          <Card className="bg-white/5 backdrop-blur-xl ring-white/12 overflow-hidden">
            {content.thumbnailUrl ? (
              <img
                src={content.thumbnailUrl}
                alt={content.title}
                className="aspect-video w-full object-cover"
              />
            ) : (
              <div className="aspect-video w-full bg-white/5" />
            )}
            <CardContent className="space-y-3">
              {content.previewUrl && (
                <div className="space-y-1.5">
                  <p className="text-xs font-medium text-white/50">
                    Preview Video
                  </p>
                  <VideoPlayer src={content.previewUrl} />
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-white/60">
                <Calendar className="h-3.5 w-3.5" />
                <span>
                  Created {new Date(content.createdAt).toLocaleDateString()}
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
              {totalDocuments > 0 && (
                <div className="flex items-center gap-2 text-sm text-white/60">
                  <FileText className="h-3.5 w-3.5" />
                  <span>
                    {totalDocuments}{' '}
                    {totalDocuments === 1 ? 'document' : 'documents'}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right: Sections & lessons / Documents */}
        <div className="lg:col-span-2 space-y-4">
          {/* Tab bar */}
          {playingVideo && playingVideo.hlsUrl && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-white/70">
                  Now playing: {playingVideo.title ?? playingVideo.fileName}
                </p>
              </div>
              <VideoPlayer
                src={playingVideo.hlsUrl}
                autoPlay
                onClose={() => setPlayingVideo(null)}
              />
            </div>
          )}

          {/* Tab bar */}
          <div className="flex items-center gap-4 border-b border-white/10">
            <button
              type="button"
              onClick={() => setActiveTab('sections')}
              className={`pb-2 text-sm font-medium transition-colors ${
                activeTab === 'sections'
                  ? 'border-b-2 border-white text-white'
                  : 'text-white/40 hover:text-white/60'
              }`}
            >
              Sections & Videos
            </button>
            {totalDocuments > 0 && (
              <button
                type="button"
                onClick={() => setActiveTab('documents')}
                className={`pb-2 text-sm font-medium transition-colors ${
                  activeTab === 'documents'
                    ? 'border-b-2 border-white text-white'
                    : 'text-white/40 hover:text-white/60'
                }`}
              >
                Documents ({totalDocuments})
              </button>
            )}
          </div>

          {activeTab === 'sections' && (
            <>
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
                  const videos = (section.medias ?? []).filter(
                    (m) => m.mediaType !== 2,
                  )

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
                          {videos.length}{' '}
                          {videos.length === 1 ? 'video' : 'videos'}
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
                          {videos.map((m, vIdx) => (
                            <button
                              type="button"
                              key={m.id}
                              disabled={!m.hlsUrl}
                              onClick={() => m.hlsUrl && setPlayingVideo(m)}
                              className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-white/3 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <div
                                className={`flex h-7 w-7 items-center justify-center rounded-full ${
                                  playingVideo?.id === m.id
                                    ? 'bg-green-500/20'
                                    : 'bg-white/8'
                                }`}
                              >
                                <Play
                                  className={`h-3 w-3 ${
                                    playingVideo?.id === m.id
                                      ? 'text-green-400'
                                      : 'text-white/50'
                                  }`}
                                />
                              </div>
                              <span className="text-xs text-white/30 w-5">
                                {vIdx + 1}.
                              </span>
                              <span
                                className={`flex-1 text-sm ${
                                  playingVideo?.id === m.id
                                    ? 'text-white'
                                    : 'text-white/70'
                                }`}
                              >
                                {m.title ?? m.fileName}
                              </span>
                              <span
                                className={`text-xs ${
                                  m.hlsUrl
                                    ? 'text-green-400/60'
                                    : 'text-white/30'
                                }`}
                              >
                                {m.hlsUrl ? 'Ready' : 'Processing'}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </>
          )}

          {activeTab === 'documents' && (
            <>
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">Documents</h2>
                <span className="text-xs text-white/30">
                  {totalDocuments}{' '}
                  {totalDocuments === 1 ? 'document' : 'documents'}
                </span>
              </div>

              <div className="space-y-3">
                {sections.map((section, sIdx) => {
                  const docs = (section.medias ?? []).filter(
                    (m: ContentMedia) => m.mediaType === 2,
                  )
                  if (docs.length === 0) return null

                  return (
                    <div key={section.id} className="space-y-2">
                      <h3 className="text-sm font-medium text-white/60">
                        <span className="inline-flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px] font-medium text-white/60 mr-2">
                          {sIdx + 1}
                        </span>
                        {section.title}
                      </h3>
                      <div className="space-y-1">
                        {docs.map((doc: ContentMedia) => (
                          <div
                            key={doc.id}
                            className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/2 px-4 py-3 transition-colors hover:bg-white/5"
                          >
                            <FileText className="h-4 w-4 shrink-0 text-white/40" />
                            <div className="min-w-0 flex-1">
                              <p className="text-sm text-white/70 truncate">
                                {doc.title ?? doc.fileName}
                              </p>
                              {doc.mimeType && (
                                <p className="text-xs text-white/30">
                                  {doc.mimeType}
                                </p>
                              )}
                            </div>
                            {doc.downloadUrl && (
                              <a
                                href={doc.downloadUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex h-7 items-center gap-1 rounded border border-white/12 bg-white/5 px-2 text-xs text-white/50 transition-colors hover:bg-white/10 hover:text-white/80"
                              >
                                <Download className="h-3 w-3" />
                                Download
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Assigned Students */}
      {assignedData?.assignments && assignedData.assignments.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">
            Assigned Students ({assignedData?.assignments?.length ?? 0})
          </h2>
          <div className="space-y-2">
            {assignedData?.assignments && assignedData?.assignments?.map((assignment) => (
              <div
                key={assignment.id}
                className="flex items-center gap-4 rounded-xl border border-white/12 bg-white/5 px-4 py-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-white/90">
                    {assignment.student?.uniqueId ?? assignment.studentId}{' '}
                    {assignment.student?.fullName ?? ''}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-blue-500 transition-all"
                      style={{ width: `${assignment.progress}%` }}
                    />
                  </div>
                  <span className="text-xs text-white/50 w-8 text-right">
                    {assignment.progress}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <AssignContentFromDetailSheet
        contentId={contentId}
        contentTitle={content.title}
        open={assignSheetOpen}
        onOpenChange={setAssignSheetOpen}
      />
    </div>
  )
}
