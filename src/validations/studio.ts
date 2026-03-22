import { z } from 'zod'

// ─── Step 1: General Details ────────────────────────────────────────────

export const generalDetailsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  year: z.string().min(1, 'Year is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
})

// ─── Step 2: Upload Media ───────────────────────────────────────────────

export const uploadMediaSchema = z.object({
  thumbnailFile: z.instanceof(File, { message: 'Thumbnail is required' }),
  videoFile: z.instanceof(File, { message: 'Preview video is required' }),
})

// ─── Step 3: Learning Sections ──────────────────────────────────────────

export const lessonVideoSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Video title is required'),
  duration: z.string().min(1, 'Duration is required'),
  file: z.instanceof(File, { message: 'Video file is required' }).nullable(),
})

export const sectionDocumentSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Document title is required'),
  file: z.instanceof(File, { message: 'Document file is required' }).nullable(),
})

export const sectionSchema = z.object({
  id: z.string(),
  title: z.string().min(1, 'Section title is required'),
  description: z.string(),
  videos: z.array(lessonVideoSchema).min(1, 'At least one video is required'),
  documents: z.array(sectionDocumentSchema),
  isOpen: z.boolean(),
})

export const learningSectionsSchema = z.object({
  sections: z.array(sectionSchema).min(1, 'At least one section is required'),
})

// ─── Step schemas array (indexed by step number) ────────────────────────

export const stepSchemas = [
  generalDetailsSchema,
  uploadMediaSchema,
  learningSectionsSchema,
  z.object({}), // finalization step — no validation
] as const

// ─── Full form schema ──────────────────────────────────────────────────

export type LessonVideo = z.infer<typeof lessonVideoSchema>
export type SectionDocument = z.infer<typeof sectionDocumentSchema>
export type Section = z.infer<typeof sectionSchema>
export type GeneralDetails = z.infer<typeof generalDetailsSchema>
export type UploadMedia = z.infer<typeof uploadMediaSchema>
export type LearningSections = z.infer<typeof learningSectionsSchema>
