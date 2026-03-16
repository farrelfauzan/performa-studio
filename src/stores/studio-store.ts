import { create } from 'zustand'
import type { Section } from '@/validations/studio'
import { stepSchemas } from '@/validations/studio'

type StudioFormState = {
  // Step tracking
  step: number

  // Step 1: General Details
  title: string
  year: string
  category: string
  description: string

  // Step 2: Media
  thumbnailPreview: string | null
  videoPreview: string | null
  thumbnailFile: File | null
  videoFile: File | null

  // Step 3: Sections
  sections: Section[]

  // UI state
  isSubmitting: boolean
  isSaving: boolean
  errors: Record<string, string>
}

type StudioFormActions = {
  // Field updates
  setField: <K extends keyof StudioFormState>(
    key: K,
    value: StudioFormState[K],
  ) => void

  // Step navigation
  setStep: (step: number) => void

  // Section actions
  addSection: () => void
  updateSection: (id: string, patch: Partial<Section>) => void
  removeSection: (id: string) => void
  toggleSection: (id: string) => void

  // Video actions
  addVideo: (sectionId: string) => void
  updateVideo: (
    sectionId: string,
    videoId: string,
    patch: Partial<Section['videos'][number]>,
  ) => void
  removeVideo: (sectionId: string, videoId: string) => void

  // Validation
  validateStep: (step: number) => boolean
  clearErrors: () => void

  // Submit state
  setSubmitting: (v: boolean) => void
  setSaving: (v: boolean) => void

  // Reset
  reset: () => void
}

let idCounter = 0
function genId() {
  return `id-${++idCounter}-${Date.now()}`
}

const initialState: StudioFormState = {
  step: 0,
  title: '',
  year: new Date().getFullYear().toString(),
  category: '',
  description: '',
  thumbnailPreview: null,
  videoPreview: null,
  thumbnailFile: null,
  videoFile: null,
  sections: [],
  isSubmitting: false,
  isSaving: false,
  errors: {},
}

export const useStudioStore = create<StudioFormState & StudioFormActions>(
  (set, get) => ({
    ...initialState,

    setField: (key, value) => set({ [key]: value }),

    setStep: (step) => set({ step }),

    // ── Section actions ──

    addSection: () =>
      set((s) => ({
        sections: [
          ...s.sections,
          {
            id: genId(),
            title: '',
            description: '',
            videos: [],
            isOpen: true,
          },
        ],
      })),

    updateSection: (id, patch) =>
      set((s) => ({
        sections: s.sections.map((sec) =>
          sec.id === id ? { ...sec, ...patch } : sec,
        ),
      })),

    removeSection: (id) =>
      set((s) => ({
        sections: s.sections.filter((sec) => sec.id !== id),
      })),

    toggleSection: (id) =>
      set((s) => ({
        sections: s.sections.map((sec) =>
          sec.id === id ? { ...sec, isOpen: !sec.isOpen } : sec,
        ),
      })),

    // ── Video actions ──

    addVideo: (sectionId) =>
      set((s) => ({
        sections: s.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                videos: [
                  ...sec.videos,
                  { id: genId(), title: '', duration: '', file: null },
                ],
              }
            : sec,
        ),
      })),

    updateVideo: (sectionId, videoId, patch) =>
      set((s) => ({
        sections: s.sections.map((sec) =>
          sec.id === sectionId
            ? {
                ...sec,
                videos: sec.videos.map((v) =>
                  v.id === videoId ? { ...v, ...patch } : v,
                ),
              }
            : sec,
        ),
      })),

    removeVideo: (sectionId, videoId) =>
      set((s) => ({
        sections: s.sections.map((sec) =>
          sec.id === sectionId
            ? { ...sec, videos: sec.videos.filter((v) => v.id !== videoId) }
            : sec,
        ),
      })),

    // ── Validation ──

    validateStep: (step) => {
      const schema = stepSchemas[step]
      if (!schema) return true

      const state = get()
      const stepData: Record<number, unknown> = {
        0: {
          title: state.title,
          year: state.year,
          category: state.category,
          description: state.description,
        },
        1: {
          thumbnailFile: state.thumbnailFile,
          videoFile: state.videoFile,
        },
        2: {
          sections: state.sections,
        },
        3: {},
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

    clearErrors: () => set({ errors: {} }),

    setSubmitting: (v) => set({ isSubmitting: v }),
    setSaving: (v) => set({ isSaving: v }),

    reset: () => set(initialState),
  }),
)
