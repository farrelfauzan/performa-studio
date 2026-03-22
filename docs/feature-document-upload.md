# Feature: Document Upload per Section

## Overview

Add the ability to attach documents (PDF, DOCX, XLSX, PPTX, etc.) to each content section alongside existing video uploads. Users can bulk-upload documents during the creation wizard, and viewers can browse all documents via a **Documents** tab on the content detail page.

---

## Current State

| Layer | Status |
|-------|--------|
| Prisma `MediaType` enum | Already has `DOCUMENT` ✅ |
| `ContentMedia` model | Supports any `mediaType` ✅ |
| `ContentSection` → `medias` relation | Exists ✅ |
| Proto `MediaType` enum | Only `IMAGE = 0`, `VIDEO = 1` ❌ |
| Proto `CreateContentWithSectionsRequest` | Only `videos` per section ❌ |
| Backend repository | Only creates VIDEO/IMAGE media placeholders ❌ |
| Frontend types | `ContentMediaType = 0 | 1` (no DOCUMENT) ❌ |
| Wizard Step 2 | Only video inputs per section ❌ |
| Detail page | No Documents tab ❌ |

---

## Changes Required

### 1. Proto Definition (`proto/content-service.proto`)

**Add `DOCUMENT = 2` to `MediaType` enum:**
```protobuf
enum MediaType {
  IMAGE = 0;
  VIDEO = 1;
  DOCUMENT = 2;
}
```

**Add `documents` field to `SectionInput`:**
```protobuf
message SectionInput {
  string title = 1;
  string description = 2;
  int32 sort_order = 3;
  repeated VideoInput videos = 4;
  repeated DocumentInput documents = 5;  // NEW
}

message DocumentInput {
  string file_name = 1;
  string content_type = 2;
  int64 file_size = 3;
}
```

**Add document upload URLs to `CreateContentWithSectionsResponse`:**
```protobuf
message SectionUploadUrls {
  repeated UploadUrlInfo video_upload_urls = 1;
  repeated UploadUrlInfo document_upload_urls = 2;  // NEW
}
```

Then regenerate types: `pnpm generate-proto-types`

---

### 2. Backend DTO (`libs/src/zod-dtos/content-dtos/create-content-with-sections.dto.ts`)

**Add `documents` to section schema:**
```ts
const DocumentInputSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  fileSize: z.number().positive(),
});

const SectionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  sortOrder: z.number().int().min(0),
  videos: z.array(VideoInputSchema).min(1),
  documents: z.array(DocumentInputSchema).optional().default([]),
});
```

---

### 3. Content Repository (`apps/content-service/src/app/repositories/content.repository.ts`)

In `createContentWithSections`, after creating video media placeholders per section, also create DOCUMENT media placeholders:

```
For each section.documents:
  → Create ContentMedia with mediaType: DOCUMENT, fileName, mimeType, fileSize
  → Link to Content + ContentSection
  → Generate presigned S3 upload URL (path: documents/<contentId>/<sectionId>/<fileName>)
  → Return document_upload_urls alongside video_upload_urls
```

**Key differences from video flow:**
- No HLS conversion needed — documents are stored as-is
- `processingStatus` set to `COMPLETED` immediately (no processing pipeline)
- S3 key pattern: `documents/{contentId}/{sectionId}/{uuid}-{fileName}`
- No duration/width/height fields

---

### 4. Content Media Repository (`apps/content-service/src/app/repositories/content-media.repository.ts`)

**Add `getDocumentUploadUrls` method:**
```ts
async getDocumentUploadUrls(items: DocumentUploadItem[]): Promise<UploadUrlInfo[]> {
  // For each item, generate a presigned POST URL via S3
  // Similar to getBulkUploadUrls but for documents (no HLS conversion)
}
```

This uses the S3Client directly (like the profile picture upload) rather than the HLS converter service.

---

### 5. Frontend Types (`performa-studio/src/lib/types.ts`)

```ts
// Update ContentMediaType
type ContentMediaType = 0 | 1 | 2  // IMAGE, VIDEO, DOCUMENT

// Add document input type
type CreateSectionDocumentInput = {
  fileName: string
  contentType: string
  fileSize: number
  file: File
}

// Update CreateSectionInput
type CreateSectionInput = {
  title: string
  description: string
  sortOrder: number
  videos: CreateSectionVideoInput[]
  documents: CreateSectionDocumentInput[]  // NEW
}

// Update response types to include document upload URLs per section
```

---

### 6. Wizard Store (`src/stores/studio-store.ts`)

**Add `documents` array to section state:**
```ts
type SectionState = {
  id: string
  title: string
  isOpen: boolean
  videos: VideoState[]
  documents: DocumentState[]  // NEW
}

type DocumentState = {
  id: string
  fileName: string
  fileSize: number
  contentType: string
  file: File | null
}
```

**Add actions:**
- `addDocument(sectionId)` — opens file picker for documents
- `removeDocument(sectionId, documentId)`
- `addBulkDocuments(sectionId, files: File[])` — add multiple at once

---

### 7. Wizard Step 2 — Section Component (`src/components/studio/step-learning-sections.tsx`)

**Per section, add a documents area below the video slots:**

```
┌─ Section 1 ──────────────────────────────────┐
│ Title: [Introduction to Calculus]             │
│                                               │
│ Videos:                                       │
│  ┌ Video 1 ─────────────────────────────────┐ │
│  │ [title] [duration] [file picker]         │ │
│  └──────────────────────────────────────────┘ │
│  [+ Add Video]                                │
│                                               │
│ Documents:                                    │
│  ┌──────────────────────────────────────────┐ │
│  │ 📄 syllabus.pdf          1.2 MB    [✕]  │ │
│  │ 📄 exercises.docx        340 KB    [✕]  │ │
│  │ 📄 reference-sheet.xlsx  89 KB     [✕]  │ │
│  └──────────────────────────────────────────┘ │
│  [📎 Upload Documents]  ← opens multi-file   │
│                            picker             │
└───────────────────────────────────────────────┘
```

- **"Upload Documents" button** opens a file picker with `multiple` and `accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv"`
- Selected files are added as `DocumentState` entries
- Each document row shows icon, filename, size, and a remove button
- No minimum required — documents are optional per section

---

### 8. Wizard Validation (`src/validations/studio.ts`)

**Update Step 2 schema — documents are optional:**
```ts
documents: z.array(
  z.object({
    fileName: z.string().min(1),
    file: z.instanceof(File),
    fileSize: z.number().max(50 * 1024 * 1024, 'Max 50MB per document'),
    contentType: z.string(),
  })
).optional().default([])
```

---

### 9. Content Creation Hook (`src/hooks/use-content-creation.ts`)

**Update `createAndUpload()`:**

After uploading videos for each section, also upload documents:
```
For each section:
  1. Upload videos to S3 (existing)
  2. Upload documents to S3 (NEW — use same uploadToS3 helper)
     → No conversion trigger needed for documents
```

---

### 10. Wizard Finalization (`src/components/studio/step-finalization.tsx`)

**Show document counts in the summary:**
```
Sections: 3
Total Videos: 8
Total Documents: 5   ← NEW
```

Per section breakdown:
```
Section 1: Introduction
  • 2 videos
  • 3 documents (syllabus.pdf, exercises.docx, reference-sheet.xlsx)
```

---

### 11. Content Detail Page (`src/routes/(dashboard)/dashboard/studio_.$contentId.tsx`)

**Add a tab system with "Videos" and "Documents" tabs:**

```
┌─────────────────────────────────────────────────┐
│ [Videos]  [Documents]                           │
├─────────────────────────────────────────────────┤
│ Documents tab:                                  │
│                                                 │
│ Section 1: Introduction                         │
│  📄 syllabus.pdf              1.2 MB  [⬇ Download] │
│  📄 exercises.docx            340 KB  [⬇ Download] │
│                                                 │
│ Section 2: Advanced Topics                      │
│  📄 formula-cheat-sheet.pdf   89 KB   [⬇ Download] │
│  📄 lab-report-template.docx  120 KB  [⬇ Download] │
│  📄 dataset.csv               2.3 MB  [⬇ Download] │
└─────────────────────────────────────────────────┘
```

- Group documents by section
- Show file icon (based on extension), filename, file size
- Download button opens `originalUrl` in a new tab
- If no documents, show empty state: "No documents uploaded for this content"

---

### 12. Document Access — Presigned GET URLs

Documents are stored **privately** in S3 (no public read policy). Access is controlled via presigned GET URLs generated server-side on every fetch.

**How it works:**
1. `ContentMedia` stores the S3 key in `objectPath` (e.g., `documents/{contentId}/{sectionId}/{uuid}-{file}`)
2. `originalUrl` in the DB is left as the raw S3 URI (or empty) — **never exposed to the client**
3. When `getContentById` is called, the backend generates a presigned GET URL for each DOCUMENT media
4. The presigned URL is returned in a `downloadUrl` field in the response
5. URLs expire in **24 hours**
6. Every content fetch generates **fresh URLs**, so there's no stale link problem

**Why not cache presigned URLs?**
- 24h expiry is generous — users will naturally re-fetch before expiry
- Content detail pages always call `getContentById` (fresh URLs on every view)
- Avoids Redis/cache complexity for a simple use case
- Document count per content is small (tens, not thousands), so generation is fast

**Backend changes:**

In `content.repository.ts` → `getContentById`:
```ts
// After fetching content with sections + medias:
for (const section of content.sections) {
  for (const media of section.medias) {
    if (media.mediaType === 'DOCUMENT') {
      media.downloadUrl = await this.s3Service.getPresignedGetUrl(
        media.objectPath,
        24 * 60 * 60  // 24 hours
      );
    }
  }
}
```

**New method in content-media repository or a shared S3 utility:**
```ts
async getPresignedGetUrl(key: string, expiresIn: number): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: this.bucketName,
    Key: key,
  });
  return getSignedUrl(this.s3Client, command, { expiresIn });
}
```

Requires `@aws-sdk/s3-request-presigner` package.

**Proto changes:**

Add `download_url` to `ContentMedia` message:
```protobuf
message ContentMedia {
  // ... existing fields ...
  optional string download_url = 20;  // presigned GET URL, populated for DOCUMENT type
}
```

**Frontend:**
- Use `media.downloadUrl` for the download button (not `originalUrl`)
- Download button: `<a href={media.downloadUrl} target="_blank" rel="noopener">`

**S3 bucket policy — NO public read for documents:**
```
Do NOT add a public read policy for documents/*.
Only hls/* and profile-pictures/* remain public.
```

---

### 13. S3 Bucket Policy

**No change needed for documents** — they remain private and are accessed only via presigned URLs.

Existing public prefixes stay as-is:
- `hls/*` — public (HLS video streams)
- `profile-pictures/*` — public (avatar images)

---

## Allowed File Types

| Extension | MIME Type |
|-----------|-----------|
| .pdf | application/pdf |
| .doc | application/msword |
| .docx | application/vnd.openxmlformats-officedocument.wordprocessingml.document |
| .xls | application/vnd.ms-excel |
| .xlsx | application/vnd.openxmlformats-officedocument.spreadsheetml.sheet |
| .ppt | application/vnd.ms-powerpoint |
| .pptx | application/vnd.openxmlformats-officedocument.presentationml.presentation |
| .txt | text/plain |
| .csv | text/csv |

**Max file size:** 50MB per document

---

## Implementation Order

| Step | Task | Files |
|------|------|-------|
| 1 | Add `DOCUMENT = 2` to proto `MediaType` + `DocumentInput` + `download_url` to `ContentMedia` + update `SectionInput` | `proto/content-service.proto` |
| 2 | Regenerate proto types | `types/proto/content-service.ts` |
| 3 | Install `@aws-sdk/s3-request-presigner` | `package.json` |
| 4 | Update backend DTO with documents in section schema | `libs/src/zod-dtos/content-dtos/create-content-with-sections.dto.ts` |
| 5 | Add `getDocumentUploadUrls` + `getPresignedGetUrl` to content-media repository | `apps/content-service/.../content-media.repository.ts` |
| 6 | Update `createContentWithSections` to create DOCUMENT media + get upload URLs | `apps/content-service/.../content.repository.ts` |
| 7 | Update `getContentById` to generate presigned GET URLs for DOCUMENT media | `apps/content-service/.../content.repository.ts` |
| 8 | Update frontend types (add `downloadUrl`, `DOCUMENT` media type, document input) | `src/lib/types.ts` |
| 9 | Update wizard store with document state + actions | `src/stores/studio-store.ts` |
| 10 | Update Step 2 validation (documents optional) | `src/validations/studio.ts` |
| 11 | Update Step 2 UI — add document upload area per section | `src/components/studio/step-learning-sections.tsx` |
| 12 | Update Step 4 finalization summary | `src/components/studio/step-finalization.tsx` |
| 13 | Update creation hook to upload documents after videos | `src/hooks/use-content-creation.ts` |
| 14 | Add Documents tab to content detail page (use `downloadUrl` for downloads) | `src/routes/(dashboard)/dashboard/studio_.$contentId.tsx` |

---

## Out of Scope (for now)

- Document preview/viewer (PDF inline viewer, etc.)
- Document search/filtering
- Drag-and-drop reordering of documents
- Document versioning
- Max total documents per section limit
