import { Trash2, Image, Video } from 'lucide-react'
import { useStudioStore } from '@/stores/studio-store'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

// ─── Upload Zone ────────────────────────────────────────────────────────

function UploadZone({
  label,
  accept,
  icon: Icon,
  preview,
  onFile,
  onClear,
}: {
  label: string
  accept: string
  icon: typeof Image
  preview: string | null
  onFile: (file: File, url: string) => void
  onClear: () => void
}) {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onFile(file, URL.createObjectURL(file))
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) onFile(file, URL.createObjectURL(file))
  }

  if (preview) {
    return (
      <div className="relative rounded-xl border border-white/12 bg-white/5 overflow-hidden">
        {accept.startsWith('video') ? (
          <video src={preview} controls className="w-full h-48 object-cover" />
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-48 object-cover"
          />
        )}
        <Button
          variant="destructive"
          size="icon-xs"
          onClick={onClear}
          className="absolute top-2 right-2"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    )
  }

  return (
    <label
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-white/12 bg-white/5 px-6 py-12 text-center transition-colors hover:border-white/25 hover:bg-white/8"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
        <Icon className="h-5 w-5 text-white/40" />
      </div>
      <div>
        <p className="text-sm font-medium text-white/70">{label}</p>
        <p className="mt-0.5 text-xs text-white/30">
          Drag & drop or click to browse
        </p>
      </div>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        className="hidden"
      />
    </label>
  )
}

// ─── Step Component ─────────────────────────────────────────────────────

export function StepUploadMedia() {
  const { thumbnailPreview, videoPreview, errors, setField } = useStudioStore()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-white">Upload Media</h2>
        <p className="mt-1 text-sm text-white/40">
          Add a thumbnail and preview video for your content
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Thumbnail</Label>
          <UploadZone
            label="Upload thumbnail image"
            accept="image/*"
            icon={Image}
            preview={thumbnailPreview}
            onFile={(file, url) => {
              setField('thumbnailFile', file)
              setField('thumbnailPreview', url)
            }}
            onClear={() => {
              setField('thumbnailFile', null)
              setField('thumbnailPreview', null)
            }}
          />
          {errors.thumbnailFile && (
            <p className="text-xs text-red-400">{errors.thumbnailFile}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label>Preview Video</Label>
          <UploadZone
            label="Upload preview video"
            accept="video/*"
            icon={Video}
            preview={videoPreview}
            onFile={(file, url) => {
              setField('videoFile', file)
              setField('videoPreview', url)
            }}
            onClear={() => {
              setField('videoFile', null)
              setField('videoPreview', null)
            }}
          />
          {errors.videoFile && (
            <p className="text-xs text-red-400">{errors.videoFile}</p>
          )}
        </div>
      </div>
    </div>
  )
}
