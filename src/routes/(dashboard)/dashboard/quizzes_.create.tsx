import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Plus,
  Trash2,
  GripVertical,
  ImagePlus,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Wizard, type WizardStep } from '@/components/wizard'
import { useQuizStore } from '@/stores/quiz-store'
import { useCreateQuiz } from '@/hooks/use-quizzes'
import { quizApi, uploadToS3 } from '@/lib/api'
import { QuestionType } from '@/lib/types'

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'settings',
    title: 'Quiz Settings',
    description: 'Title, time limit & rules',
  },
  {
    id: 'questions',
    title: 'Questions',
    description: 'Add and configure questions',
  },
]

const QUESTION_TYPE_LABELS: Record<number, string> = {
  [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QuestionType.TRUE_FALSE]: 'True / False',
  [QuestionType.SHORT_ANSWER]: 'Short Answer',
  [QuestionType.MULTI_SELECT]: 'Multi Select',
}

export const Route = createFileRoute(
  '/(dashboard)/dashboard/quizzes_/create',
)({
  component: CreateQuizPage,
})

function CreateQuizPage() {
  const navigate = useNavigate()
  const store = useQuizStore()
  const createQuiz = useCreateQuiz()

  useEffect(() => {
    return () => store.reset()
  }, [])

  const handleBeforeNext = (currentStep: number) =>
    store.validateStep(currentStep)

  const handleStepChange = (newStep: number) => {
    if (newStep < store.step) {
      store.clearErrors()
      store.setStep(newStep)
      return
    }
    store.setStep(newStep)
  }

  const handleFinish = async () => {
    if (!store.validateStep(1)) return

    store.setSubmitting(true)
    try {
      const result = await createQuiz.mutateAsync({
        title: store.title,
        description: store.description || undefined,
        timeLimitSecs: store.timeLimitMins
          ? Number(store.timeLimitMins) * 60
          : undefined,
        passingScore: Number(store.passingScore),
        maxAttempts: Number(store.maxAttempts),
        shuffleQuestions: store.shuffleQuestions,
        questions: store.questions.map((q, idx) => ({
          type: q.type,
          text: q.text,
          explanation: q.explanation || undefined,
          points: q.points,
          sortOrder: idx,
          options: q.options.map((o, oIdx) => ({
            text: o.text,
            isCorrect: o.isCorrect,
            sortOrder: oIdx,
          })),
        })),
      })

      // Upload any local blob pictures
      const quiz = result.data
      if (quiz?.questions) {
        const uploadPromises = store.questions
          .map((localQ, idx) => {
            if (!localQ.pictureUrl?.startsWith('blob:')) return null
            const serverQ = quiz.questions[idx]
            if (!serverQ) return null
            return (async () => {
              const blob = await fetch(localQ.pictureUrl!).then((r) =>
                r.blob(),
              )
              const file = new File([blob], `question-${idx}.jpg`, {
                type: blob.type,
              })
              const { data } = await quizApi.getQuestionPictureUploadUrl(
                quiz.id,
                serverQ.id,
                { filename: file.name, contentType: file.type },
              )
              await uploadToS3(data.uploadUrl, data.fields, file)
              await quizApi.updateQuestion(quiz.id, serverQ.id, {
                pictureUrl: data.publicUrl,
              })
            })()
          })
          .filter(Boolean)

        if (uploadPromises.length > 0) {
          await Promise.all(uploadPromises)
        }
      }

      toast.success('Quiz created successfully!')
      navigate({ to: '/dashboard/quizzes', search: { page: 0, q: '' } })
    } catch {
      toast.error('Failed to create quiz')
    } finally {
      store.setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() =>
            navigate({ to: '/dashboard/quizzes', search: { page: 0, q: '' } })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Quiz</h1>
          <p className="mt-0.5 text-sm text-white/50">
            Set up your quiz step by step
          </p>
        </div>
      </div>

      <Wizard
        steps={WIZARD_STEPS}
        currentStep={store.step}
        onStepChange={handleStepChange}
        onBeforeNext={handleBeforeNext}
        onFinish={handleFinish}
        isSubmitting={store.isSubmitting}
      >
        {store.step === 0 && <StepSettings />}
        {store.step === 1 && <StepQuestions />}
      </Wizard>
    </div>
  )
}

// ─── Step 1: Settings ───────────────────────────────────────────────────

function StepSettings() {
  const { title, description, timeLimitMins, passingScore, maxAttempts, shuffleQuestions, errors, setField } =
    useQuizStore()

  return (
    <div className="space-y-6 max-w-xl">
      <div className="space-y-2">
        <Label htmlFor="title">Title *</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setField('title', e.target.value)}
          placeholder="Enter quiz title"
        />
        {errors.title && (
          <p className="text-xs text-red-400">{errors.title}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setField('description', e.target.value)}
          placeholder="Optional quiz description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="timeLimitMins">Time Limit (minutes)</Label>
          <Input
            id="timeLimitMins"
            inputMode="numeric"
            value={timeLimitMins}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '')
              setField('timeLimitMins', v)
            }}
            placeholder="No limit"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="passingScore">Passing Score (%)</Label>
          <Input
            id="passingScore"
            inputMode="numeric"
            value={passingScore}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '')
              const n = Math.min(Number(v) || 0, 100)
              setField('passingScore', String(n))
            }}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="maxAttempts">Max Attempts</Label>
          <Input
            id="maxAttempts"
            inputMode="numeric"
            value={maxAttempts}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '')
              setField('maxAttempts', v)
            }}
          />
        </div>

        <div className="flex items-center gap-3 pt-6">
          <Switch
            checked={shuffleQuestions}
            onCheckedChange={(v) => setField('shuffleQuestions', v)}
          />
          <Label>Shuffle Questions</Label>
        </div>
      </div>
    </div>
  )
}

// ─── Step 2: Questions ──────────────────────────────────────────────────

function StepQuestions() {
  const {
    questions,
    errors,
    addQuestion,
    updateQuestion,
    removeQuestion,
    addOption,
    updateOption,
    removeOption,
    setCorrectOption,
  } = useQuizStore()

  return (
    <div className="space-y-6">
      {errors.questions && (
        <p className="text-xs text-red-400">{errors.questions}</p>
      )}

      {questions.map((q, qIdx) => (
        <div
          key={q.id}
          className="rounded-xl border border-white/12 bg-white/5 p-5 space-y-4"
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2">
              <GripVertical className="h-4 w-4 text-white/30 cursor-grab" />
              <span className="text-sm font-medium text-white/60">
                Q{qIdx + 1}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={String(q.type)}
                onValueChange={(v) =>
                  updateQuestion(q.id, { type: Number(v) })
                }
              >
                <SelectTrigger className="w-44 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(QUESTION_TYPE_LABELS).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => removeQuestion(q.id)}
              >
                <Trash2 className="h-4 w-4 text-red-400" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Input
              value={q.text}
              onChange={(e) => updateQuestion(q.id, { text: e.target.value })}
              placeholder="Question text"
            />
            {errors[`questions.${qIdx}.text`] && (
              <p className="text-xs text-red-400">
                {errors[`questions.${qIdx}.text`]}
              </p>
            )}
          </div>

          {/* Question Picture */}
          <QuestionPictureField
            pictureUrl={q.pictureUrl || ''}
            onPictureChange={(url) => updateQuestion(q.id, { pictureUrl: url })}
          />

          {/* Options (not for SHORT_ANSWER) */}
          {q.type !== QuestionType.SHORT_ANSWER && (
            <div className="space-y-2">
              <Label className="text-xs text-white/50">Options</Label>
              {q.options.map((opt) => (
                <div key={opt.id} className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setCorrectOption(q.id, opt.id)}
                    className={`h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${
                      opt.isCorrect
                        ? 'border-green-400 bg-green-400'
                        : 'border-white/30 hover:border-white/50'
                    }`}
                  />
                  <Input
                    value={opt.text}
                    onChange={(e) =>
                      updateOption(q.id, opt.id, { text: e.target.value })
                    }
                    placeholder="Option text"
                    className="flex-1"
                    disabled={q.type === QuestionType.TRUE_FALSE}
                  />
                  {q.type !== QuestionType.TRUE_FALSE && (
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      onClick={() => removeOption(q.id, opt.id)}
                    >
                      <Trash2 className="h-3 w-3 text-white/40" />
                    </Button>
                  )}
                </div>
              ))}
              {q.type !== QuestionType.TRUE_FALSE && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => addOption(q.id)}
                >
                  <Plus className="mr-1 h-3 w-3" />
                  Add Option
                </Button>
              )}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label className="text-xs text-white/50">Points (0–100)</Label>
              <Input
                inputMode="numeric"
                value={q.points}
                onChange={(e) => {
                  const v = e.target.value.replace(/\D/g, '')
                  const n = Math.min(Number(v) || 0, 100)
                  updateQuestion(q.id, { points: n })
                }}
                className="h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-white/50">
                Explanation (shown after attempt)
              </Label>
              <Input
                value={q.explanation || ''}
                onChange={(e) =>
                  updateQuestion(q.id, { explanation: e.target.value })
                }
                placeholder="Optional"
                className="h-8"
              />
            </div>
          </div>
        </div>
      ))}

      <Button variant="outline" onClick={() => addQuestion()}>
        <Plus className="mr-2 h-4 w-4" />
        Add Question
      </Button>
    </div>
  )
}

// ─── Question Picture Field ─────────────────────────────────────────────

function QuestionPictureField({
  pictureUrl,
  onPictureChange,
}: {
  pictureUrl: string
  onPictureChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB')
      return
    }
    const url = URL.createObjectURL(file)
    onPictureChange(url)
  }

  const handleRemove = () => {
    if (pictureUrl.startsWith('blob:')) {
      URL.revokeObjectURL(pictureUrl)
    }
    onPictureChange('')
    if (inputRef.current) inputRef.current.value = ''
  }

  if (pictureUrl) {
    return (
      <div className="relative inline-block">
        <img
          src={pictureUrl}
          alt="Question"
          className="max-h-40 rounded-lg border border-white/12 object-contain"
        />
        <button
          type="button"
          onClick={handleRemove}
          className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    )
  }

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button
        variant="outline"
        size="sm"
        type="button"
        onClick={() => inputRef.current?.click()}
      >
        <ImagePlus className="mr-1 h-3.5 w-3.5" />
        Add Picture
      </Button>
    </div>
  )
}
