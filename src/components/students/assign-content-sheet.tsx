import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Search, Check, Loader2 } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Field, FieldError } from '@/components/ui/field'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
} from '@/components/ui/input-group'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Toggle } from '@/components/ui/toggle'
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

  const { data: contentsData, isLoading: contentsLoading } = useStudioProjects({
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
      <SheetContent className="w-120 flex flex-col">
        <SheetHeader>
          <SheetTitle>Assign Content</SheetTitle>
          <SheetDescription>
            Select content to assign to {studentName}
          </SheetDescription>
        </SheetHeader>

        <Separator />

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto py-4 px-6">
            <InputGroup>
              <InputGroupAddon align="inline-start">
                <InputGroupText>
                  <Search />
                </InputGroupText>
              </InputGroupAddon>
              <InputGroupInput
                placeholder="Search content..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </InputGroup>

            <form.Field
              name="contentId"
              validators={{
                onChange: validateWithZod(contentIdSchema),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label>Select Content</Label>
                  <div className="space-y-2">
                    {contentsLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <Card key={i} size="sm" className="animate-pulse">
                          <CardContent className="flex items-center gap-3">
                            <Skeleton className="h-5 w-5 rounded" />
                            <div className="flex-1 space-y-1.5">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/3" />
                            </div>
                          </CardContent>
                        </Card>
                      ))
                    ) : (contentsData?.projects.length ?? 0) === 0 ? (
                      <Card size="sm">
                        <CardContent>
                          <p className="py-6 text-center text-sm text-muted-foreground">
                            No content found
                          </p>
                        </CardContent>
                      </Card>
                    ) : (
                      contentsData?.projects.map((content: Content) => {
                        const isAssigned = alreadyAssigned.has(content.id)
                        const isSelected = field.state.value === content.id

                        return (
                          <Toggle
                            key={content.id}
                            variant="outline"
                            pressed={isSelected}
                            disabled={isAssigned}
                            onPressedChange={() =>
                              field.handleChange(
                                isSelected ? '' : content.id,
                              )
                            }
                            className="flex h-auto w-full items-center justify-start gap-3 rounded-xl p-3"
                          >
                            <div
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                                isAssigned || isSelected
                                  ? 'border-primary bg-primary'
                                  : 'border-muted-foreground/30'
                              }`}
                            >
                              {(isAssigned || isSelected) && (
                                <Check className="h-3 w-3 text-primary-foreground" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                              <p className="text-sm font-medium truncate">
                                {content.title}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {content.sections?.length ?? 0} sections
                              </p>
                            </div>
                            {isAssigned && (
                              <Badge variant="secondary" className="shrink-0 text-[10px]">
                                Assigned
                              </Badge>
                            )}
                          </Toggle>
                        )
                      })
                    )}
                  </div>
                  {field.state.meta.isTouched &&
                    field.state.meta.errors.length > 0 && (
                      <FieldError>{field.state.meta.errors[0]}</FieldError>
                    )}
                </Field>
              )}
            </form.Field>

            <Separator />

            <form.Field name="dueDate">
              {(field) => (
                <Field>
                  <Label>Due Date (optional)</Label>
                  <InputGroup>
                    <InputGroupInput
                      type="date"
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                    />
                  </InputGroup>
                </Field>
              )}
            </form.Field>
          </div>

          <Separator />

          <SheetFooter>
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
                  {(isSubmitting || isPending) && (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  )}
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
