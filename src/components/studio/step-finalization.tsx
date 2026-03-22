import { Info } from 'lucide-react'
import { useStudioStore } from '@/stores/studio-store'
import { Card, CardContent } from '@/components/ui/card'
import { useCategories } from '@/hooks/use-categories'

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between px-4 py-3">
      <span className="text-sm text-white/40">{label}</span>
      <span className="text-sm text-white/80 text-right max-w-[60%] wrap-break-word">
        {value}
      </span>
    </div>
  )
}

export function StepFinalization() {
  const {
    title,
    year,
    category,
    description,
    thumbnailFile,
    videoFile,
    sections,
  } = useStudioStore()

  const totalVideos = sections.reduce((sum, s) => sum + s.videos.length, 0)
  const totalDocuments = sections.reduce(
    (sum, s) => sum + s.documents.length,
    0,
  )

  const { data: categories = [] } = useCategories()
  const categoryName = categories.find((c) => c.id === category)?.name ?? ''

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Review & Publish</h2>
        <p className="mt-1 text-sm text-white/40">
          Review your content before publishing
        </p>
      </div>

      {/* Approval notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-400" />
        <div className="text-sm">
          <p className="font-medium text-amber-400">Admin Approval Required</p>
          <p className="mt-0.5 text-muted-foreground">
            All new content will be reviewed by the Performa admin team before
            going live. You will be notified once your content is approved.
          </p>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card size="sm" className="bg-white/5 backdrop-blur-xl ring-white/12">
          <CardContent>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Sections
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {sections.length}
            </p>
          </CardContent>
        </Card>
        <Card size="sm" className="bg-white/5 backdrop-blur-xl ring-white/12">
          <CardContent>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Videos
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {totalVideos}
            </p>
          </CardContent>
        </Card>
        <Card size="sm" className="bg-white/5 backdrop-blur-xl ring-white/12">
          <CardContent>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Total Documents
            </p>
            <p className="mt-1 text-2xl font-semibold text-white">
              {totalDocuments}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Details */}
      <Card size="sm" className="bg-white/5 backdrop-blur-xl ring-white/12">
        <CardContent className="divide-y divide-border/50">
          <SummaryRow label="Title" value={title || '—'} />
          <SummaryRow label="Year" value={year || '—'} />
          <SummaryRow label="Category" value={categoryName || '—'} />
          <SummaryRow label="Description" value={description || '—'} />
          <SummaryRow
            label="Thumbnail"
            value={thumbnailFile ? thumbnailFile.name : 'Not uploaded'}
          />
          <SummaryRow
            label="Preview Video"
            value={videoFile ? videoFile.name : 'Not uploaded'}
          />
        </CardContent>
      </Card>

      {/* Sections breakdown */}
      {sections.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-white/60">
            Sections Overview
          </h3>
          <div className="space-y-2">
            {sections.map((section, idx) => (
              <Card
                key={section.id}
                size="sm"
                className="bg-white/5 backdrop-blur-xl ring-white/12"
              >
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded bg-white/10 text-[10px] font-medium text-white/60">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-white/80">
                        {section.title || 'Untitled Section'}
                      </span>
                    </div>
                    <span className="text-xs text-white/30">
                      {section.videos.length}{' '}
                      {section.videos.length === 1 ? 'video' : 'videos'}                      {section.documents.length > 0 &&
                        `, ${section.documents.length} ${section.documents.length === 1 ? 'doc' : 'docs'}`}                    </span>
                  </div>
                  {section.videos.length > 0 && (
                    <div className="mt-2 ml-7 space-y-1">
                      {section.videos.map((video, vIdx) => (
                        <div
                          key={video.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-white/50">
                            {vIdx + 1}. {video.title || 'Untitled Video'}
                          </span>
                          <span className="text-white/30">
                            {video.duration || '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                  {section.documents.length > 0 && (
                    <div className="mt-2 ml-7 space-y-1">
                      <p className="text-[10px] uppercase tracking-wider text-white/25">
                        Documents
                      </p>
                      {section.documents.map((doc, dIdx) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between text-xs"
                        >
                          <span className="text-white/50">
                            {dIdx + 1}. {doc.title || 'Untitled Document'}
                          </span>
                          <span className="text-white/30">
                            {doc.file?.name || '—'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
