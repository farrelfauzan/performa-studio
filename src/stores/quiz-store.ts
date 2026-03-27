import { create } from 'zustand'
import type { QuizQuestion, QuizOption } from '@/validations/quiz'
import { quizStepSchemas } from '@/validations/quiz'

type QuizFormState = {
  // Step tracking
  step: number

  // Step 1: Settings
  title: string
  description: string
  timeLimitMins: string
  passingScore: string
  maxAttempts: string
  shuffleQuestions: boolean

  // Step 2: Questions
  questions: QuizQuestion[]

  // UI state
  isSubmitting: boolean
  errors: Record<string, string>
}

type QuizFormActions = {
  setField: <K extends keyof QuizFormState>(
    key: K,
    value: QuizFormState[K],
  ) => void

  setStep: (step: number) => void

  // Question actions
  addQuestion: (type?: number) => void
  updateQuestion: (id: string, patch: Partial<QuizQuestion>) => void
  removeQuestion: (id: string) => void
  reorderQuestions: (ids: string[]) => void

  // Option actions
  addOption: (questionId: string) => void
  updateOption: (
    questionId: string,
    optionId: string,
    patch: Partial<QuizOption>,
  ) => void
  removeOption: (questionId: string, optionId: string) => void
  setCorrectOption: (questionId: string, optionId: string) => void

  // Validation
  validateStep: (step: number) => boolean
  clearError: (key: string) => void
  clearErrors: () => void

  setSubmitting: (v: boolean) => void
  reset: () => void
}

let idCounter = 0
function genId() {
  return `qid-${++idCounter}-${Date.now()}`
}

const initialState: QuizFormState = {
  step: 0,
  title: '',
  description: '',
  timeLimitMins: '',
  passingScore: '70',
  maxAttempts: '3',
  shuffleQuestions: false,
  questions: [],
  isSubmitting: false,
  errors: {},
}

export const useQuizStore = create<QuizFormState & QuizFormActions>(
  (set, get) => ({
    ...initialState,

    setField: (key, value) =>
      set((s) => {
        if (s.errors[key as string]) {
          const { [key as string]: _, ...rest } = s.errors
          return { [key]: value, errors: rest }
        }
        return { [key]: value }
      }),

    setStep: (step) => set({ step }),

    // ── Question actions ──

    addQuestion: (type = 0) =>
      set((s) => ({
        questions: [
          ...s.questions,
          {
            id: genId(),
            type,
            text: '',
            explanation: '',
            pictureUrl: '',
            points: 1,
            options:
              type === 1 // TRUE_FALSE
                ? [
                    { id: genId(), text: 'True', isCorrect: true },
                    { id: genId(), text: 'False', isCorrect: false },
                  ]
                : [
                    { id: genId(), text: '', isCorrect: false },
                    { id: genId(), text: '', isCorrect: false },
                  ],
          },
        ],
      })),

    updateQuestion: (id, patch) =>
      set((s) => ({
        questions: s.questions.map((q) =>
          q.id === id ? { ...q, ...patch } : q,
        ),
      })),

    removeQuestion: (id) =>
      set((s) => ({
        questions: s.questions.filter((q) => q.id !== id),
      })),

    reorderQuestions: (ids) =>
      set((s) => {
        const map = new Map(s.questions.map((q) => [q.id, q]))
        return {
          questions: ids.map((id) => map.get(id)!).filter(Boolean),
        }
      }),

    // ── Option actions ──

    addOption: (questionId) =>
      set((s) => ({
        questions: s.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: [
                  ...q.options,
                  { id: genId(), text: '', isCorrect: false },
                ],
              }
            : q,
        ),
      })),

    updateOption: (questionId, optionId, patch) =>
      set((s) => ({
        questions: s.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.map((o) =>
                  o.id === optionId ? { ...o, ...patch } : o,
                ),
              }
            : q,
        ),
      })),

    removeOption: (questionId, optionId) =>
      set((s) => ({
        questions: s.questions.map((q) =>
          q.id === questionId
            ? {
                ...q,
                options: q.options.filter((o) => o.id !== optionId),
              }
            : q,
        ),
      })),

    setCorrectOption: (questionId, optionId) =>
      set((s) => ({
        questions: s.questions.map((q) => {
          if (q.id !== questionId) return q
          // For MULTIPLE_CHOICE and TRUE_FALSE, only one correct
          if (q.type === 0 || q.type === 1) {
            return {
              ...q,
              options: q.options.map((o) => ({
                ...o,
                isCorrect: o.id === optionId,
              })),
            }
          }
          // For MULTI_SELECT, toggle
          return {
            ...q,
            options: q.options.map((o) =>
              o.id === optionId ? { ...o, isCorrect: !o.isCorrect } : o,
            ),
          }
        }),
      })),

    // ── Validation ──

    validateStep: (step) => {
      const schema = quizStepSchemas[step]
      if (!schema) return true

      const state = get()
      const stepData: Record<number, unknown> = {
        0: {
          title: state.title,
          description: state.description,
          timeLimitMins: state.timeLimitMins
            ? Number(state.timeLimitMins)
            : undefined,
          passingScore: Number(state.passingScore),
          maxAttempts: Number(state.maxAttempts),
          shuffleQuestions: state.shuffleQuestions,
        },
        1: {
          questions: state.questions,
        },
      }

      const result = schema.safeParse(stepData[step])

      if (result.success) {
        set({ errors: {} })
        return true
      }

      const errors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const path = issue.path.join('.')
        if (!errors[path]) {
          errors[path] = issue.message
        }
      }
      set({ errors })
      return false
    },

    clearError: (key) =>
      set((s) => {
        if (!s.errors[key]) return s
        const { [key]: _, ...rest } = s.errors
        return { errors: rest }
      }),

    clearErrors: () => set({ errors: {} }),

    setSubmitting: (v) => set({ isSubmitting: v }),

    reset: () => set(initialState),
  }),
)
