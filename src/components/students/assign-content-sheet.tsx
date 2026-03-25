import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Search, Check } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useStudioProjects } from '@/hooks/use-studio'
import {
  useStudentAssignments,
  useCreateAssignment,
} from '@/hooks/use-assignments'
import { validateWithZod } from '@/lib/utils'
import type { Content } from '@/lib/types'

const contentIdSchema = z.string().min(1, 'Please select content to assign')

interface AssignContentSheetProps {
  studentId: string
  studentName: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignContentSheet({
  studentId,
  studentName,
  open,
  onOpenChange,
}: AssignContentSheetProps) {
  const [search, setSearch] = useState('')

  const { data: contentsData } = useStudioProjects({
    search: search || undefined,
    pageSize: 50,
  })
  const { data: assignmentsData } = useStudentAssignments(studentId)
  const { mutate: createAssignment, isPending } = useCreateAssignment()

  const alreadyAssigned = new Set(
    assignmentsData?.assignments?.map((a) => a.contentId) ?? [],
  )

  const form = useForm({
    defaultValues: {
      contentId: '',
      dueDate: '',
    },
    onSubmit: async ({ value }) => {
      if (alreadyAssigned.has(value.contentId)) return
      createAssignment(
        {
          studentId,
          contentId: value.contentId,
          dueDate: value.dueDate || undefined,
        },
        {
          onSuccess: () => {
            form.reset()
            onOpenChange(false)
          },
        },
      )
    },
  })

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[480px] flex flex-col">
        <SheetHeader>
          <SheetTitle className="text-white">
            Assign Content to {studentName}
          </SheetTitle>
        </SheetHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto py-4 px-6">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <Input
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <form.Field
              name="contentId"
              validators={{
                onChange: validateWithZod(contentIdSchema),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <div className="space-y-2">
                    {contentsData?.projects.map((content: Content) => {
                      const isAssigned = alreadyAssigned.has(content.id)
                      const isSelected = field.state.value === content.id

                      return (
                        <button
                          key={content.id}
                          type="button"
                          disabled={isAssigned}
                          onClick={() =>
                            field.handleChange(
                              isSelected ? '' : content.id,
                            )
                          }
                          className={`flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors ${
                            isAssigned
                              ? 'opacity-50 cursor-not-allowed bg-white/3'
                              : isSelected
                                ? 'bg-blue-500/15 ring-1 ring-blue-500/30'
                                : 'bg-white/5 hover:bg-white/8'
                          }`}
                        >
                          <div
                            className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border ${
                              isAssigned || isSelected
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-white/20'
                            }`}
                          >
                            {(isAssigned || isSelected) && (
                              <Check className="h-3 w-3 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-white/90 truncate">
                              {content.title}
                            </p>
                            <p className="text-xs text-white/40">
                              {content.sections?.length ?? 0} sections
                              {isAssigned && ' (already assigned)'}
                            </p>
                          </div>
                        </button>
                      )
                    })}

                    {(contentsData?.projects.length ?? 0) === 0 && (
                      <p className="py-8 text-center text-sm text-white/30">
                        No content found
                      </p>
                    )}
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                </Field>
              )}
            </form.Field>

            <form.Field name="dueDate">
              {(field) => (
                <Field>
                  <Label className="text-white/70">Due Date (optional)</Label>
                  <Input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <SheetFooter className="px-6 pb-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <form.Subscribe
              selector={(state) => [state.values.contentId, state.isSubmitting] as const}
            >
              {([contentId, isSubmitting]) => (
                <Button
                  type="submit"
                  disabled={
                    !contentId ||
                    alreadyAssigned.has(contentId) ||
                    isSubmitting ||
                    isPending
                  }
                >
                  {isSubmitting || isPending ? 'Assigning...' : 'Assign'}
                </Button>
              )}
            </form.Subscribe>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
