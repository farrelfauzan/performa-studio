# Content Integration Flow — performa-studio ↔ performa-edu

## Overview

This document describes how the **performa-studio** frontend wizard maps to the **performa-edu** backend's two-phase upload API for content creation.

The frontend uses a 4-step wizard. On final submission, a **three-phase** process executes:

```
Wizard Steps (UI)                 Backend Phases (on submit)
─────────────────                 ──────────────────────────
Step 0: General Details    ──►    Collected in Zustand store
Step 1: Upload Media       ──►    Collected in Zustand store
Step 2: Learning Sections  ──►    Collected in Zustand store
Step 3: Finalization       ──►    Phase 1 → Phase 2 → Phase 3
```

---

## Wizard Steps → Data Collection

### Step 0: General Details
Collects: `title`, `year`, `category` (mapped to `categoryId`), `description` (mapped to `body`)

### Step 1: Upload Media
Collects: `thumbnailFile` (File object), `videoFile` (preview video File object)

### Step 2: Learning Sections
Collects: Array of sections, each with title, description, and video files:
```ts
sections: [
  {
    id: string           // local ID
    title: string
    description: string
    videos: [
      {
        id: string       // local ID
        title: string
        file: File | null
      }
    ]
  }
]
```

### Step 3: Finalization
Review all data. On "Submit for Approval" → trigger three-phase process.

---

## Three-Phase Submission Process

### Phase 1: Create Content + Get Presigned Upload URLs

**Frontend Action:** Assemble all wizard data into a single API call.

**Endpoint:** `POST /api/v1/contents/with-sections`

**Request Body Mapping:**

```
Zustand Store Field     →  API Request Field
──────────────────────     ─────────────────
title                   →  title
category                →  categoryId
year                    →  year (number)
description             →  body
(hardcoded 0)          →  status (DRAFT)
thumbnailFile           →  thumbnail { fileName, mimeType, fileSize }
videoFile               →  previewVideo { fileName, mimeType, fileSize }
sections[].title        →  sections[].title
sections[].description  →  sections[].description
sections[].index        →  sections[].sortOrder
sections[].videos[]     →  sections[].videos[] { title, sortOrder, fileName, mimeType, fileSize }
```

**Request Example:**
```json
{
  "title": "React Advanced Patterns",
  "categoryId": "clxxx...",
  "year": 2026,
  "body": "Learn advanced React patterns...",
  "status": 0,
  "sections": [
    {
      "title": "Getting Started",
      "description": "Introduction to the course",
      "sortOrder": 0,
      "videos": [
        {
          "title": "Welcome",
          "sortOrder": 0,
          "fileName": "welcome.mp4",
          "mimeType": "video/mp4",
          "fileSize": 52428800
        }
      ]
    }
  ],
  "thumbnail": {
    "fileName": "cover.jpg",
    "mimeType": "image/jpeg",
    "fileSize": 256000
  },
  "previewVideo": {
    "fileName": "preview.mp4",
    "mimeType": "video/mp4",
    "fileSize": 10485760
  }
}
```

**Response:**
```json
{
  "data": {
    "content": { "id": "content_123", "title": "...", ... },
    "sections": [
      { "id": "section_1", "title": "Getting Started", "medias": [...] }
    ],
    "uploadUrls": [
      {
        "mediaId": "media_1",
        "uploadUrl": "https://s3.amazonaws.com/bucket",
        "fields": { "key": "uploads/abc.mp4", "policy": "...", ... },
        "s3Key": "uploads/abc.mp4",
        "expiresIn": 3600
      }
    ],
    "thumbnailUploadUrl": {
      "mediaId": "media_thumb",
      "uploadUrl": "https://s3.amazonaws.com/bucket",
      "fields": { ... },
      "s3Key": "uploads/thumb-abc.jpg",
      "expiresIn": 3600
    },
    "previewUploadUrl": {
      "mediaId": "media_preview",
      "uploadUrl": "https://s3.amazonaws.com/bucket",
      "fields": { ... },
      "s3Key": "uploads/preview-abc.mp4",
      "expiresIn": 3600
    }
  }
}
```

---

### Phase 2: Upload Files Directly to S3

**Frontend Action:** Upload each file directly to S3 using the presigned URLs from Phase 1.

For **each** upload URL (section videos + thumbnail + preview video):

```ts
async function uploadToS3(
  uploadUrl: string,
  fields: Record<string, string>,
  file: File
): Promise<void> {
  const formData = new FormData()

  // Add all presigned fields first
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value)
  }

  // Append file last
  formData.append('file', file)

  const response = await fetch(uploadUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    throw new Error(`Upload failed: ${response.statusText}`)
  }
}
```

**Upload Order:**
1. Upload thumbnail (if provided)
2. Upload preview video (if provided)
3. Upload section videos (can be parallelized with `Promise.allSettled`)

**Progress Tracking:**
- Track per-file upload status: `pending` → `uploading` → `completed` / `failed`
- Display progress in the Finalization step UI

**File-to-URL Mapping:**
The frontend must match each `File` object from the store to the correct upload URL returned by Phase 1. The mapping is:

| Store File | Response URL |
|-----------|-------------|
| `thumbnailFile` | `thumbnailUploadUrl` |
| `videoFile` (preview) | `previewUploadUrl` |
| `sections[i].videos[j].file` | `uploadUrls[k]` (matched by order — videos are returned in the same section/sort order as requested) |

---

### Phase 3: Trigger HLS Conversion

**Frontend Action:** After all video files are uploaded, trigger conversion.

**Endpoint:** `POST /api/v1/contents/:id/convert`

**Request:** `{ "callbackUrl": "https://your-domain/api/v1/contents/webhooks/conversion" }` (optional — backend handles webhooks internally through the API gateway)

**Response:**
```json
{
  "data": {
    "jobs": [
      { "mediaId": "media_1", "jobId": "job_abc" },
      { "mediaId": "media_preview", "jobId": "job_def" }
    ]
  }
}
```

> **Note:** Thumbnail images do not go through HLS conversion. Only video files (section videos + preview video) are converted.

---

## Error Handling

### Phase 1 Failure
- API returns error → display error toast, user can retry submit
- Content is NOT created in backend

### Phase 2 Failure (Partial Upload)
- Some files may upload successfully, others may fail
- Content and sections already exist in backend (from Phase 1)
- Failed uploads: track and display which files failed
- User can retry failed uploads without re-creating the content
- Proceed to Phase 3 only when all uploads succeed

### Phase 3 Failure
- Files are uploaded but conversion not triggered
- User can retry conversion
- Content remains in DRAFT with videos in PENDING status

### Recovery Strategy
```
If Phase 1 fails → retry from Phase 1
If Phase 2 fails → retry failed uploads only (content already exists)
If Phase 3 fails → retry conversion call only (files already uploaded)
```

---

## Submission State Machine

```
IDLE
  │ user clicks "Submit for Approval"
  ▼
CREATING ─── Phase 1: POST /contents/with-sections
  │
  ▼
UPLOADING ─── Phase 2: Upload files to S3
  │            (track per-file progress)
  ▼
CONVERTING ─── Phase 3: POST /contents/:id/convert
  │
  ▼
COMPLETE ─── redirect to studio list
```

Display in Finalization step:
```
[ ] Creating content...        ← Phase 1
[ ] Uploading thumbnail...     ← Phase 2
[ ] Uploading preview video... ← Phase 2
[ ] Uploading Section 1 videos... ← Phase 2
[ ] Starting conversion...     ← Phase 3
```

---

## Save Draft Flow

When user clicks "Save Draft" at any step:
- **Endpoint:** `POST /api/v1/contents/with-sections` with `status: 0` (DRAFT)
- Only Phase 1 is executed (create content metadata)
- No file uploads or conversion
- User can return later to upload and convert

---

## Code Architecture

```
src/
├── lib/
│   ├── api.ts            # API endpoint functions
│   └── types.ts          # Backend response types
├── hooks/
│   └── use-content-creation.ts  # Three-phase orchestration hook
├── stores/
│   └── studio-store.ts   # Wizard form state (existing)
└── routes/
    └── (dashboard)/dashboard/
        └── studio_.create.tsx   # Wizard page (wire handleFinish)
```

### Hook: `useContentCreation`

```ts
function useContentCreation() {
  return useApiMutation(
    async (formData: StudioFormState) => {
      // Phase 1: Create content + get upload URLs
      const result = await contentApi.createWithSections(payload)

      // Phase 2: Upload files to S3
      await uploadAllFiles(result.data, formData)

      // Phase 3: Trigger conversion
      await contentApi.startConversion(result.data.content.id)

      return result.data.content
    },
    { invalidateQueries: ['studio-projects', 'dashboard'] }
  )
}
```
