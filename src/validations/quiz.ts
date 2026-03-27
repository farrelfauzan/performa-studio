import { z } from 'zod'

// ─── Option Schema ──────────────────────────────────────────────────────

export const optionSchema = z.object({
  id: z.string(),
  text: z.string().min(1, 'Option text is required'),
  isCorrect: z.boolean(),
})

// ─── Question Schema ────────────────────────────────────────────────────

export const questionSchema = z.object({
  id: z.string(),
  type: z.number().min(0).max(3),
  text: z.string().min(1, 'Question text is required'),
  explanation: z.string().optional().default(''),
  pictureUrl: z.string().optional().default(''),
  points: z.coerce
    .number()
    .int()
    .min(0, 'Points must be 0–100')
    .max(100)
    .default(1),
  options: z.array(optionSchema),
})

// ─── Quiz Settings Schema (Step 1) ─────────────────────────────────────

export const quizSettingsSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional().default(''),
  timeLimitMins: z.coerce.number().int().min(0).optional(),
  passingScore: z.coerce.number().int().min(0).max(100).default(70),
  maxAttempts: z.coerce.number().int().min(1).default(3),
  shuffleQuestions: z.boolean().default(false),
})

// ─── Questions Schema (Step 2) ──────────────────────────────────────────

export const quizQuestionsSchema = z.object({
  questions: z
    .array(questionSchema)
    .min(1, 'At least one question is required'),
})

// ─── Step schemas array ─────────────────────────────────────────────────

export const quizStepSchemas = [
  quizSettingsSchema,
  quizQuestionsSchema,
] as const

// ─── Types ──────────────────────────────────────────────────────────────

export type QuizOption = z.infer<typeof optionSchema>
export type QuizQuestion = z.infer<typeof questionSchema>
export type QuizSettings = z.infer<typeof quizSettingsSchema>
export type QuizQuestions = z.infer<typeof quizQuestionsSchema>
