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
import { useStudents } from '@/hooks/use-students'
import {
  useContentAssignments,
  useBulkCreateAssignment,
} from '@/hooks/use-assignments'
import { validateWithZod } from '@/lib/utils'

const studentIdsSchema = z
  .array(z.string())
  .min(1, 'Select at least one student')

interface AssignContentFromDetailSheetProps {
  contentId: string
  contentTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AssignContentFromDetailSheet({
  contentId,
  contentTitle,
  open,
  onOpenChange,
}: AssignContentFromDetailSheetProps) {
  const [search, setSearch] = useState('')

  const { data: studentsData } = useStudents({
    search: search || undefined,
    pageSize: 50,
  })
  const { data: assignedData } = useContentAssignments(contentId)
  const { mutate: bulkAssign, isPending } = useBulkCreateAssignment()

  const alreadyAssigned = new Set(
    assignedData?.assignments.map((a) => a.studentId) ?? [],
  )

  const form = useForm({
    defaultValues: {
      studentIds: [] as string[],
      dueDate: '',
    },
    onSubmit: async ({ value }) => {
      const newSelections = value.studentIds.filter(
        (id) => !alreadyAssigned.has(id),
      )
      if (newSelections.length === 0) return
      bulkAssign(
        {
          studentIds: newSelections,
          contentId,
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
            Assign &ldquo;{contentTitle}&rdquo;
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
                placeholder="Search students..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            <form.Field
              name="studentIds"
              validators={{
                onChange: validateWithZod(studentIdsSchema),
              }}
            >
              {(field) => {
                const newSelections = field.state.value.filter(
                  (id) => !alreadyAssigned.has(id),
                )
                const toggleStudent = (id: string) => {
                  const current = field.state.value
                  field.handleChange(
                    current.includes(id)
                      ? current.filter((x) => x !== id)
                      : [...current, id],
                  )
                }

                return (
                  <Field
                    data-invalid={field.state.meta.errors.length > 0}
                  >
                    <div className="space-y-2">
                      {studentsData?.students.map((student) => {
                        const isAssigned = alreadyAssigned.has(student.id)
                        const isSelected = field.state.value.includes(
                          student.id,
                        )

                        return (
                          <button
                            key={student.id}
                            type="button"
                            disabled={isAssigned}
                            onClick={() => toggleStudent(student.id)}
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
                                {student.uniqueId} &mdash;{' '}
                                {student.fullName}
                              </p>
                              <p className="text-xs text-white/40">
                                {isAssigned
                                  ? 'Already assigned'
                                  : student.active.toLowerCase()}
                              </p>
                            </div>
                          </button>
                        )
                      })}

                      {(studentsData?.students.length ?? 0) === 0 && (
                        <p className="py-8 text-center text-sm text-white/30">
                          No students found
                        </p>
                      )}
                    </div>

                    {newSelections.length > 0 && (
                      <p className="text-sm text-white/60">
                        Selected: {newSelections.length} new{' '}
                        {newSelections.length === 1 ? 'student' : 'students'}
                      </p>
                    )}

                    {field.state.meta.isTouched &&
                      field.state.meta.errors.length > 0 && (
                        <FieldError>
                          {field.state.meta.errors[0]}
                        </FieldError>
                      )}
                  </Field>
                )
              }}
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
              selector={(state) => [state.values.studentIds, state.isSubmitting] as const}
            >
              {([studentIds, isSubmitting]) => {
                const newCount = studentIds.filter(
                  (id) => !alreadyAssigned.has(id),
                ).length
                return (
                  <Button
                    type="submit"
                    disabled={newCount === 0 || isSubmitting || isPending}
                  >
                    {isSubmitting || isPending
                      ? 'Assigning...'
                      : `Assign (${newCount})`}
                  </Button>
                )
              }}
            </form.Subscribe>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
