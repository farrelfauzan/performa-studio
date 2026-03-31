import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Search, Check } from 'lucide-react'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useStudents } from '@/hooks/use-students'
import { useAddStudents, useClassStudents } from '@/hooks/use-classes'
import { validateWithZod } from '@/lib/utils'

const studentIdsSchema = z
  .array(z.string())
  .min(1, 'Select at least one student')

interface AddStudentsToClassSheetProps {
  classId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddStudentsToClassSheet({
  classId,
  open,
  onOpenChange,
}: AddStudentsToClassSheetProps) {
  const [search, setSearch] = useState('')

  const { data: studentsData } = useStudents({
    search: search || undefined,
    pageSize: 50,
  })

  const { data: classStudentsData } = useClassStudents(classId)

  const { mutate: addStudents, isPending } = useAddStudents()

  const alreadyAdded = new Set(
    classStudentsData?.students?.map((s) => s.studentId) ?? [],
  )

  const form = useForm({
    defaultValues: {
      studentIds: [] as string[],
    },
    onSubmit: async ({ value }) => {
      const newIds = value.studentIds.filter((id) => !alreadyAdded.has(id))
      if (newIds.length === 0) return
      addStudents(
        { classId, studentIds: newIds },
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
          <SheetTitle className="text-white">Add Students</SheetTitle>
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
                const toggleStudent = (id: string) => {
                  const current = field.state.value
                  field.handleChange(
                    current.includes(id)
                      ? current.filter((s) => s !== id)
                      : [...current, id],
                  )
                }

                return (
                  <div className="space-y-1">
                    {studentsData?.students.map((student) => {
                      const isAlreadyAdded = alreadyAdded.has(student.id)
                      const isSelected = field.state.value.includes(student.id)
                      return (
                        <button
                          key={student.id}
                          type="button"
                          disabled={isAlreadyAdded}
                          onClick={() => toggleStudent(student.id)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors ${
                            isAlreadyAdded
                              ? 'cursor-not-allowed opacity-50'
                              : isSelected
                                ? 'bg-white/10 ring-1 ring-white/20'
                                : 'hover:bg-white/5'
                          }`}
                        >
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={student.profilePictureUrl ?? undefined}
                            />
                            <AvatarFallback className="bg-white/10 text-xs text-white/60">
                              {student.fullName
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-white/90">
                              {student.fullName}
                            </p>
                            <p className="text-xs text-white/40">
                              {student.uniqueId}
                            </p>
                          </div>
                          {isAlreadyAdded && (
                            <span className="text-xs text-white/30">
                              Already added
                            </span>
                          )}
                          {isSelected && !isAlreadyAdded && (
                            <Check className="h-4 w-4 text-green-400" />
                          )}
                        </button>
                      )
                    })}
                    {studentsData?.students.length === 0 && (
                      <p className="py-8 text-center text-sm text-white/30">
                        No students found
                      </p>
                    )}
                  </div>
                )
              }}
            </form.Field>
          </div>

          <SheetFooter className="px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Students'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}
