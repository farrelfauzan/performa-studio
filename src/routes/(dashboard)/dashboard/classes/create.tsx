import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Field, FieldError } from '@/components/ui/field'
import { useCreateClass } from '@/hooks/use-classes'
import { validateWithZod } from '@/lib/utils'
import { createClassSchema } from '@/validations/class'

export const Route = createFileRoute(
  '/(dashboard)/dashboard/classes/create',
)({
  component: CreateClassPage,
})

function CreateClassPage() {
  const navigate = useNavigate()
  const { mutate: createClass, isPending } = useCreateClass()

  const form = useForm({
    defaultValues: {
      name: '',
      description: '',
    },
    onSubmit: async ({ value }) => {
      createClass(
        {
          name: value.name,
          description: value.description || undefined,
        },
        {
          onSuccess: (res) => {
            const classId = (res as any)?.data?.id
            if (classId) {
              navigate({
                to: '/dashboard/classes/$classId',
                params: { classId },
              })
            } else {
              navigate({
                to: '/dashboard/classes',
                search: { page: 0, q: '' },
              })
            }
          },
        },
      )
    },
  })

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() =>
            navigate({
              to: '/dashboard/classes',
              search: { page: 0, q: '' },
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Create Class</h1>
      </div>

      <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <CardContent className="space-y-4 pt-6">
            <form.Field
              name="name"
              validators={{
                onChange: validateWithZod(createClassSchema.shape.name),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Class Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="e.g. Mathematics Grade 10"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="description">
              {(field) => (
                <Field>
                  <Label className="text-white/70">Description</Label>
                  <Textarea
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="Optional class description..."
                    rows={4}
                  />
                </Field>
              )}
            </form.Field>
          </CardContent>

          <CardFooter className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate({
                  to: '/dashboard/classes',
                  search: { page: 0, q: '' },
                })
              }
            >
              Cancel
            </Button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting || isPending}>
                  {isSubmitting || isPending ? 'Creating...' : 'Create'}
                </Button>
              )}
            </form.Subscribe>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
