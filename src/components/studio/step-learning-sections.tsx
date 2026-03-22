import {
  Plus,
  Trash2,
  GripVertical,
  Upload,
  ChevronDown,
  ChevronUp,
  FileText,
} from 'lucide-react'
import { useStudioStore } from '@/stores/studio-store'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function StepLearningSections() {
  const {
    sections,
    errors,
    addSection,
    updateSection,
    removeSection,
    toggleSection,
    addVideo,
    updateVideo,
    removeVideo,
    addDocument,
    updateDocument,
    removeDocument,
  } = useStudioStore()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-white">
            Learning Sections
          </h2>
          <p className="mt-1 text-sm text-white/40">
            Organize your content into sections with lesson videos
          </p>
        </div>
        <Button size="sm" onClick={addSection}>
          <Plus className="h-3.5 w-3.5" />
          Add Section
        </Button>
      </div>

      {errors.sections && (
        <p className="text-xs text-red-400">{errors.sections}</p>
      )}

      {sections.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-white/12 py-16 text-center">
          <p className="text-sm text-white/40">No sections yet</p>
          <p className="mt-1 text-xs text-white/25">
            Click &quot;Add Section&quot; to start organizing your content
          </p>
        </div>
      )}

      <div className="space-y-4">
        {sections.map((section, sIdx) => (
          <div
            key={section.id}
            className="rounded-xl border border-white/12 bg-white/3 overflow-hidden"
          >
            {/* Section header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-white/2">
              <GripVertical className="h-4 w-4 shrink-0 text-white/20" />
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className="flex flex-1 items-center gap-2 text-left"
              >
                <span className="flex h-6 w-6 items-center justify-center rounded bg-white/10 text-xs font-medium text-white/60">
                  {sIdx + 1}
                </span>
                <span className="text-sm font-medium text-white/80 truncate">
                  {section.title || 'Untitled Section'}
                </span>
                <span className="text-xs text-white/30">
                  ({section.videos.length}{' '}
                  {section.videos.length === 1 ? 'video' : 'videos'}
                  {section.documents.length > 0 &&
                    `, ${section.documents.length} ${section.documents.length === 1 ? 'doc' : 'docs'}`}
                  )
                </span>
                {section.isOpen ? (
                  <ChevronUp className="ml-auto h-4 w-4 text-white/30" />
                ) : (
                  <ChevronDown className="ml-auto h-4 w-4 text-white/30" />
                )}
              </button>
              <Button
                variant="ghost"
                size="icon-xs"
                onClick={() => removeSection(section.id)}
                className="text-white/30 hover:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>

            {/* Section body */}
            {section.isOpen && (
              <div className="space-y-4 px-4 py-4">
                {/* Section fields */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-xs">Section Title</Label>
                    <Input
                      value={section.title}
                      onChange={(e) =>
                        updateSection(section.id, { title: e.target.value })
                      }
                      placeholder="e.g. Getting Started"
                    />
                    {errors[`sections.${sIdx}.title`] && (
                      <p className="text-xs text-red-400">
                        {errors[`sections.${sIdx}.title`]}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs">Description</Label>
                    <Input
                      value={section.description}
                      onChange={(e) =>
                        updateSection(section.id, {
                          description: e.target.value,
                        })
                      }
                      placeholder="Brief description of this section"
                    />
                  </div>
                </div>

                {/* Videos */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">Lesson Videos</Label>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => addVideo(section.id)}
                    >
                      <Plus className="h-3 w-3" />
                      Add Video
                    </Button>
                  </div>

                  {errors[`sections.${sIdx}.videos`] && (
                    <p className="text-xs text-red-400">
                      {errors[`sections.${sIdx}.videos`]}
                    </p>
                  )}

                  {section.videos.length === 0 && (
                    <div className="rounded-lg border border-dashed border-white/12 py-6 text-center">
                      <p className="text-xs text-white/30">
                        No videos in this section
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {section.videos.map((video, vIdx) => (
                      <div key={video.id} className="space-y-1">
                        <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/2 px-3 py-2.5">
                          <GripVertical className="h-3.5 w-3.5 shrink-0 text-white/15" />
                          <span className="text-xs font-medium text-white/30 w-5">
                            {vIdx + 1}.
                          </span>
                          <Input
                            value={video.title}
                            onChange={(e) =>
                              updateVideo(section.id, video.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Video title"
                            className="h-7 flex-1 border-none bg-transparent"
                          />
                          <Input
                            value={video.duration}
                            readOnly
                            disabled
                            placeholder="0:00"
                            className="h-7 w-16 text-center text-xs"
                          />
                          <label className="flex h-7 cursor-pointer items-center gap-1 rounded border border-white/12 bg-white/5 px-2 text-xs text-white/50 transition-colors hover:bg-white/8">
                            <Upload className="h-3 w-3" />
                            {video.file ? (
                              <span className="max-w-20 truncate text-blue-400">
                                {video.file.name}
                              </span>
                            ) : (
                              'File'
                            )}
                            <input
                              type="file"
                              accept="video/*"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null
                                updateVideo(section.id, video.id, { file })
                                if (file) {
                                  const videoEl =
                                    document.createElement('video')
                                  videoEl.preload = 'metadata'
                                  videoEl.onloadedmetadata = () => {
                                    const totalSeconds = Math.floor(
                                      videoEl.duration,
                                    )
                                    const mins = Math.floor(totalSeconds / 60)
                                    const secs = totalSeconds % 60
                                    const formatted = `${mins}:${secs.toString().padStart(2, '0')}`
                                    updateVideo(section.id, video.id, {
                                      duration: formatted,
                                    })
                                    URL.revokeObjectURL(videoEl.src)
                                  }
                                  videoEl.src = URL.createObjectURL(file)
                                }
                              }}
                            />
                          </label>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() => removeVideo(section.id, video.id)}
                            className="shrink-0 text-white/25 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {errors[`sections.${sIdx}.videos.${vIdx}.title`] && (
                          <p className="text-xs text-red-400 pl-10">
                            {errors[`sections.${sIdx}.videos.${vIdx}.title`]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Documents (optional) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs">
                      Documents{' '}
                      <span className="text-white/30">(optional)</span>
                    </Label>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => addDocument(section.id)}
                    >
                      <Plus className="h-3 w-3" />
                      Add Document
                    </Button>
                  </div>

                  {section.documents.length === 0 && (
                    <div className="rounded-lg border border-dashed border-white/12 py-4 text-center">
                      <p className="text-xs text-white/30">
                        No documents in this section
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    {section.documents.map((doc, dIdx) => (
                      <div key={doc.id} className="space-y-1">
                        <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-white/2 px-3 py-2.5">
                          <FileText className="h-3.5 w-3.5 shrink-0 text-white/15" />
                          <span className="text-xs font-medium text-white/30 w-5">
                            {dIdx + 1}.
                          </span>
                          <Input
                            value={doc.title}
                            onChange={(e) =>
                              updateDocument(section.id, doc.id, {
                                title: e.target.value,
                              })
                            }
                            placeholder="Document title"
                            className="h-7 flex-1 border-none bg-transparent"
                          />
                          <label className="flex h-7 cursor-pointer items-center gap-1 rounded border border-white/12 bg-white/5 px-2 text-xs text-white/50 transition-colors hover:bg-white/8">
                            <Upload className="h-3 w-3" />
                            {doc.file ? (
                              <span className="max-w-24 truncate text-blue-400">
                                {doc.file.name}
                              </span>
                            ) : (
                              'File'
                            )}
                            <input
                              type="file"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0] ?? null
                                updateDocument(section.id, doc.id, { file })
                              }}
                            />
                          </label>
                          <Button
                            variant="ghost"
                            size="icon-xs"
                            onClick={() =>
                              removeDocument(section.id, doc.id)
                            }
                            className="shrink-0 text-white/25 hover:text-red-400"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                        {errors[
                          `sections.${sIdx}.documents.${dIdx}.title`
                        ] && (
                          <p className="text-xs text-red-400 pl-10">
                            {
                              errors[
                                `sections.${sIdx}.documents.${dIdx}.title`
                              ]
                            }
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
