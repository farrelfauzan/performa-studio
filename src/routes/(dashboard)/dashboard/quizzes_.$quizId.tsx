import { createFileRoute, useNavigate } from '@tanstack/react-router'
import {
  ArrowLeft,
  Save,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  GripVertical,
  BarChart3,
  ImagePlus,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  useQuiz,
  useUpdateQuiz,
  usePublishQuiz,
  useUnpublishQuiz,
  useAddQuestion,
  useUpdateQuestion,
  useDeleteQuestion,
  useQuizAnalytics,
  useUploadQuestionPicture,
} from '@/hooks/use-quizzes'
import { QuestionType, type Quiz, type Question } from '@/lib/types'

const QUESTION_TYPE_LABELS: Record<number, string> = {
  [QuestionType.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QuestionType.TRUE_FALSE]: 'True / False',
  [QuestionType.SHORT_ANSWER]: 'Short Answer',
  [QuestionType.MULTI_SELECT]: 'Multi Select',
}

export const Route = createFileRoute(
  '/(dashboard)/dashboard/quizzes_/$quizId',
)({
  component: QuizDetailPage,
  validateSearch: (search: Record<string, unknown>) => ({
    tab: typeof search.tab === 'string' ? search.tab : 'edit',
  }),
})

function QuizDetailPage() {
  const { quizId } = Route.useParams()
  const navigate = useNavigate()
  const { data: quiz, isLoading } = useQuiz(quizId)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/20 border-t-white" />
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="py-20 text-center text-white/50">Quiz not found</div>
    )
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
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{quiz.title}</h1>
            <Badge
              className={
                quiz.isPublished
                  ? 'bg-green-500/15 text-green-400 border-transparent'
                  : 'bg-yellow-500/15 text-yellow-400 border-transparent'
              }
            >
              {quiz.isPublished ? 'Published' : 'Draft'}
            </Badge>
          </div>
          <p className="mt-0.5 text-sm text-white/50">
            {quiz.questionCount} questions · Passing score: {quiz.passingScore}%
          </p>
        </div>
        <AnalyticsDialog quizId={quizId} />
      </div>

      <QuizSettingsEditor quiz={quiz} />
      <QuestionList quiz={quiz} />
    </div>
  )
}

// ─── Settings Editor ────────────────────────────────────────────────────

function QuizSettingsEditor({ quiz }: { quiz: Quiz }) {
  const [title, setTitle] = useState(quiz.title)
  const [description, setDescription] = useState(quiz.description || '')
  const [timeLimitMins, setTimeLimitMins] = useState(
    quiz.timeLimitSecs ? String(quiz.timeLimitSecs / 60) : '',
  )
  const [passingScore, setPassingScore] = useState(String(quiz.passingScore))
  const [maxAttempts, setMaxAttempts] = useState(String(quiz.maxAttempts))
  const [shuffle, setShuffle] = useState(quiz.shuffleQuestions)

  const updateQuiz = useUpdateQuiz(quiz.id)
  const publishQuiz = usePublishQuiz()
  const unpublishQuiz = useUnpublishQuiz()

  const handleSave = () => {
    updateQuiz.mutate(
      {
        title,
        description: description || undefined,
        ...(timeLimitMins
          ? { timeLimitSecs: Number(timeLimitMins) * 60 }
          : { clearTimeLimit: true }),
        passingScore: Number(passingScore),
        maxAttempts: Number(maxAttempts),
        shuffleQuestions: shuffle,
      },
      { onSuccess: () => toast.success('Quiz updated') },
    )
  }

  return (
    <div className="rounded-xl border border-white/12 bg-white/5 p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Settings</h2>
        <div className="flex items-center gap-2">
          {quiz.isPublished ? (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                unpublishQuiz.mutate(quiz.id, {
                  onSuccess: () => toast.success('Quiz unpublished'),
                })
              }
            >
              <EyeOff className="mr-1 h-3.5 w-3.5" />
              Unpublish
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                publishQuiz.mutate(quiz.id, {
                  onSuccess: () => toast.success('Quiz published'),
                })
              }
            >
              <Eye className="mr-1 h-3.5 w-3.5" />
              Publish
            </Button>
          )}
          <Button size="sm" onClick={handleSave} disabled={updateQuiz.isPending}>
            <Save className="mr-1 h-3.5 w-3.5" />
            Save
          </Button>
        </div>
      </div>

      <div className="grid gap-4 max-w-xl">
        <div className="space-y-1">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1">
          <Label>Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1">
            <Label className="text-xs">Time Limit (min)</Label>
            <Input
              inputMode="numeric"
              value={timeLimitMins}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '')
                setTimeLimitMins(v)
              }}
              placeholder="None"
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Passing Score (%)</Label>
            <Input
              inputMode="numeric"
              value={passingScore}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '')
                const n = Math.min(Number(v) || 0, 100)
                setPassingScore(String(n))
              }}
            />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Max Attempts</Label>
            <Input
              inputMode="numeric"
              value={maxAttempts}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '')
                setMaxAttempts(v)
              }}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={shuffle} onCheckedChange={setShuffle} />
          <Label>Shuffle Questions</Label>
        </div>
      </div>
    </div>
  )
}

// ─── Question List ──────────────────────────────────────────────────────

function QuestionList({ quiz }: { quiz: Quiz }) {
  const addQuestion = useAddQuestion(quiz.id)
  const updateQuestion = useUpdateQuestion(quiz.id)
  const deleteQuestion = useDeleteQuestion(quiz.id)

  const handleAddQuestion = (type: number = QuestionType.MULTIPLE_CHOICE) => {
    const defaultOptions =
      type === QuestionType.TRUE_FALSE
        ? [
            { text: 'True', isCorrect: true, sortOrder: 0 },
            { text: 'False', isCorrect: false, sortOrder: 1 },
          ]
        : [
            { text: 'Option A', isCorrect: true, sortOrder: 0 },
            { text: 'Option B', isCorrect: false, sortOrder: 1 },
          ]

    addQuestion.mutate(
      {
        type,
        text: 'New Question',
        points: 1,
        options: defaultOptions,
      },
      { onSuccess: () => toast.success('Question added') },
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">
          Questions ({quiz.questions?.length ?? 0})
        </h2>
        <Button variant="outline" size="sm" onClick={() => handleAddQuestion()}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add Question
        </Button>
      </div>

      {(quiz.questions ?? []).map((q, idx) => (
        <QuestionEditor
          key={q.id}
          question={q}
          index={idx}
          quizId={quiz.id}
          onUpdate={(data) =>
            updateQuestion.mutate(
              { questionId: q.id, data },
              { onSuccess: () => toast.success('Question updated') },
            )
          }
          onDelete={() =>
            deleteQuestion.mutate(q.id, {
              onSuccess: () => toast.success('Question deleted'),
            })
          }
        />
      ))}
    </div>
  )
}

// ─── Question Editor ────────────────────────────────────────────────────

function QuestionEditor({
  question,
  index,
  quizId,
  onUpdate,
  onDelete,
}: {
  question: Question
  index: number
  quizId: string
  onUpdate: (data: any) => void
  onDelete: () => void
}) {
  const [text, setText] = useState(question.text)
  const [explanation, setExplanation] = useState(question.explanation || '')
  const [points, setPoints] = useState(question.points)
  const [options, setOptions] = useState(question.options)
  const [pictureUrl, setPictureUrl] = useState(question.pictureUrl || '')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const uploadPicture = useUploadQuestionPicture(quizId)

  const handleSave = () => {
    onUpdate({
      text,
      explanation: explanation || undefined,
      points,
      pictureUrl: pictureUrl || undefined,
      options: options.map((o, i) => ({
        text: o.text,
        isCorrect: o.isCorrect,
        sortOrder: i,
      })),
    })
  }

  const handlePictureUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
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
    setIsUploading(true)
    try {
      const publicUrl = await uploadPicture.mutateAsync({
        questionId: question.id,
        file,
      })
      setPictureUrl(publicUrl)
      onUpdate({
        text,
        explanation: explanation || undefined,
        points,
        pictureUrl: publicUrl,
        options: options.map((o, i) => ({
          text: o.text,
          isCorrect: o.isCorrect,
          sortOrder: i,
        })),
      })
      toast.success('Picture uploaded')
    } catch {
      toast.error('Failed to upload picture')
    } finally {
      setIsUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleRemovePicture = () => {
    setPictureUrl('')
    onUpdate({
      text,
      explanation: explanation || undefined,
      points,
      pictureUrl: '',
      options: options.map((o, i) => ({
        text: o.text,
        isCorrect: o.isCorrect,
        sortOrder: i,
      })),
    })
  }

  return (
    <div className="rounded-xl border border-white/12 bg-white/5 p-5 space-y-3">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <GripVertical className="h-4 w-4 text-white/30" />
          <span className="text-sm font-medium text-white/60">
            Q{index + 1}
          </span>
          <Badge variant="outline" className="text-[10px]">
            {QUESTION_TYPE_LABELS[question.type] ?? 'Unknown'}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon-sm" onClick={handleSave}>
            <Save className="h-3.5 w-3.5" />
          </Button>
          <Button variant="ghost" size="icon-sm" onClick={onDelete}>
            <Trash2 className="h-3.5 w-3.5 text-red-400" />
          </Button>
        </div>
      </div>

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Question text"
      />

      {/* Question Picture */}
      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handlePictureUpload}
          className="hidden"
        />
        {pictureUrl ? (
          <div className="relative inline-block">
            <img
              src={pictureUrl}
              alt="Question"
              className="max-h-40 rounded-lg border border-white/12 object-contain"
            />
            <button
              type="button"
              onClick={handleRemovePicture}
              className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
            >
              <X className="h-3 w-3" />
            </button>
          </div>
        ) : (
          <Button
            variant="outline"
            size="sm"
            type="button"
            disabled={isUploading}
            onClick={() => fileInputRef.current?.click()}
          >
            {isUploading ? (
              <div className="mr-1 h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/20 border-t-white" />
            ) : (
              <ImagePlus className="mr-1 h-3.5 w-3.5" />
            )}
            {isUploading ? 'Uploading...' : 'Add Picture'}
          </Button>
        )}
      </div>

      {question.type !== QuestionType.SHORT_ANSWER && (
        <div className="space-y-2">
          {options.map((opt) => (
            <div key={opt.id} className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  setOptions((prev) =>
                    question.type === QuestionType.MULTI_SELECT
                      ? prev.map((o) =>
                          o.id === opt.id
                            ? { ...o, isCorrect: !o.isCorrect }
                            : o,
                        )
                      : prev.map((o) => ({
                          ...o,
                          isCorrect: o.id === opt.id,
                        })),
                  )
                }
                className={`h-5 w-5 shrink-0 rounded-full border-2 transition-colors ${
                  opt.isCorrect
                    ? 'border-green-400 bg-green-400'
                    : 'border-white/30 hover:border-white/50'
                }`}
              />
              <Input
                value={opt.text}
                onChange={(e) =>
                  setOptions((prev) =>
                    prev.map((o) =>
                      o.id === opt.id ? { ...o, text: e.target.value } : o,
                    ),
                  )
                }
                placeholder="Option text"
                className="flex-1 h-8"
                disabled={question.type === QuestionType.TRUE_FALSE}
              />
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-white/50">Points (0–100)</Label>
          <Input
            inputMode="numeric"
            value={points}
            onChange={(e) => {
              const v = e.target.value.replace(/\D/g, '')
              setPoints(Math.min(Number(v) || 0, 100))
            }}
            className="h-8"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-white/50">Explanation</Label>
          <Input
            value={explanation}
            onChange={(e) => setExplanation(e.target.value)}
            placeholder="Optional"
            className="h-8"
          />
        </div>
      </div>
    </div>
  )
}

// ─── Analytics Dialog ───────────────────────────────────────────────────

function AnalyticsDialog({ quizId }: { quizId: string }) {
  const { data, isLoading } = useQuizAnalytics(quizId)

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="mr-1 h-3.5 w-3.5" />
          Analytics
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quiz Analytics</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-white/20 border-t-white" />
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              <Stat label="Total Attempts" value={data.totalAttempts} />
              <Stat
                label="Avg Score"
                value={`${data.averageScore.toFixed(1)}%`}
              />
              <Stat
                label="Pass Rate"
                value={`${data.passRate.toFixed(1)}%`}
              />
            </div>
            {data.questionStats.length > 0 && (
              <div>
                <h3 className="text-sm font-medium text-white/70 mb-2">
                  Question Performance
                </h3>
                <div className="space-y-2">
                  {data.questionStats.map((qs) => (
                    <div
                      key={qs.questionId}
                      className="flex items-center justify-between rounded-lg border border-white/8 p-3"
                    >
                      <span className="text-sm text-white/80 truncate max-w-xs">
                        {qs.text}
                      </span>
                      <span className="text-sm text-white/50 shrink-0 ml-3">
                        {qs.correctRate.toFixed(0)}% correct
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="text-center text-sm text-white/50 py-8">
            No analytics available yet
          </p>
        )}
      </DialogContent>
    </Dialog>
  )
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-lg border border-white/8 bg-white/5 p-3 text-center">
      <p className="text-xl font-bold text-white">{value}</p>
      <p className="text-xs text-white/50">{label}</p>
    </div>
  )
}
