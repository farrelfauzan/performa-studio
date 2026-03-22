import { useStudioStore } from '@/stores/studio-store'
import { contentApi, uploadToS3 } from '@/lib/api'
import { ContentStatus } from '@/lib/types'
import type {
  CreateContentWithSectionsRequest,
  CreateContentWithSectionsResponse,
  UploadUrlInfo,
} from '@/lib/types'

function buildPayload(
  store: ReturnType<typeof useStudioStore.getState>,
  status: ContentStatus,
): CreateContentWithSectionsRequest {
  const payload: CreateContentWithSectionsRequest = {
    title: store.title,
    categoryId: store.category,
    year: Number(store.year),
    body: store.description,
    status,
    sections: store.sections.map((s, sIdx) => ({
      title: s.title,
      description: s.description || undefined,
      sortOrder: sIdx,
      videos: s.videos.map((v, vIdx) => ({
        title: v.title,
        sortOrder: vIdx,
        fileName: v.file?.name ?? `video-${vIdx}`,
        mimeType: v.file?.type ?? 'video/mp4',
        fileSize: v.file?.size ?? 0,
      })),
      documents: s.documents
        .filter((d) => d.file)
        .map((d, dIdx) => ({
          title: d.title,
          sortOrder: dIdx,
          fileName: d.file!.name,
          mimeType: d.file!.type || 'application/octet-stream',
          fileSize: d.file!.size,
        })),
    })),
  }

  if (store.thumbnailFile) {
    payload.thumbnail = {
      fileName: store.thumbnailFile.name,
      mimeType: store.thumbnailFile.type,
      fileSize: store.thumbnailFile.size,
    }
  }

  if (store.videoFile) {
    payload.previewVideo = {
      fileName: store.videoFile.name,
      mimeType: store.videoFile.type,
      fileSize: store.videoFile.size,
    }
  }

  return payload
}

/**
 * Collect all File objects keyed by a matching identifier
 * so we can pair them with presigned upload URLs.
 */
function collectFiles(store: ReturnType<typeof useStudioStore.getState>) {
  const fileMap = new Map<string, File>()

  // Section videos — keyed by "sectionIdx-videoIdx" for ordering,
  // but we'll match by array position against uploadUrls
  store.sections.forEach((section) => {
    section.videos.forEach((video) => {
      if (video.file) {
        fileMap.set(video.id, video.file)
      }
    })
  })

  return fileMap
}

function collectDocumentFiles(
  store: ReturnType<typeof useStudioStore.getState>,
) {
  const fileMap = new Map<string, File>()

  store.sections.forEach((section) => {
    section.documents.forEach((doc) => {
      if (doc.file) {
        fileMap.set(doc.id, doc.file)
      }
    })
  })

  return fileMap
}

async function uploadFiles(
  response: CreateContentWithSectionsResponse['data'],
  store: ReturnType<typeof useStudioStore.getState>,
) {
  const uploads: Promise<void>[] = []
  const fileMap = collectFiles(store)

  // Upload section videos — match uploadUrls to section video files
  // uploadUrls are returned in the same order as sections → videos
  let urlIdx = 0
  for (const section of store.sections) {
    for (const video of section.videos) {
      const urlInfo: UploadUrlInfo | undefined = response.uploadUrls[urlIdx]
      const file = fileMap.get(video.id)
      if (urlInfo && file) {
        uploads.push(uploadToS3(urlInfo.uploadUrl, urlInfo.fields, file))
      }
      urlIdx++
    }
  }

  // Upload documents — match documentUploadUrls to section document files
  const docFileMap = collectDocumentFiles(store)
  const docUploadUrls = response.documentUploadUrls ?? []
  let docUrlIdx = 0
  for (const section of store.sections) {
    for (const doc of section.documents) {
      if (!doc.file) continue
      const urlInfo: UploadUrlInfo | undefined = docUploadUrls[docUrlIdx]
      const file = docFileMap.get(doc.id)
      if (urlInfo && file) {
        uploads.push(uploadToS3(urlInfo.uploadUrl, urlInfo.fields, file))
      }
      docUrlIdx++
    }
  }

  // Upload thumbnail
  if (response.thumbnailUploadUrl && store.thumbnailFile) {
    uploads.push(
      uploadToS3(
        response.thumbnailUploadUrl.uploadUrl,
        response.thumbnailUploadUrl.fields,
        store.thumbnailFile,
      ),
    )
  }

  // Upload preview video
  if (response.previewUploadUrl && store.videoFile) {
    uploads.push(
      uploadToS3(
        response.previewUploadUrl.uploadUrl,
        response.previewUploadUrl.fields,
        store.videoFile,
      ),
    )
  }

  await Promise.all(uploads)
}

export function useContentCreation() {
  const store = useStudioStore

  const createAndUpload = async () => {
    const state = store.getState()
    const payload = buildPayload(state, ContentStatus.WAITING_REVIEW)

    // Phase 1: Create content + get presigned URLs
    const { data } = await contentApi.create(payload)

    // Phase 2: Upload all files to S3
    await uploadFiles(data, state)

    // Phase 3: Trigger HLS conversion
    await contentApi.startConversion(data.content.id)

    return data.content
  }

  const saveDraft = async () => {
    const state = store.getState()
    const payload = buildPayload(state, ContentStatus.DRAFT)

    const { data } = await contentApi.create(payload)

    // Still upload files for drafts so they're ready
    await uploadFiles(data, state)

    return data.content
  }

  return { createAndUpload, saveDraft }
}
