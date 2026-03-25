import { useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft, Eye, EyeOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import { useCreateStudent } from '@/hooks/use-students'
import { validateWithZod } from '@/lib/utils'
import { studentFieldSchemas } from '@/validations/student'

export const Route = createFileRoute(
  '/(dashboard)/dashboard/students/create',
)({
  component: CreateStudentPage,
})

function CreateStudentPage() {
  const navigate = useNavigate()
  const { mutate: createStudent, isPending } = useCreateStudent()
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      phoneNumber: '',
      dateOfBirth: '',
    },
    onSubmit: async ({ value }) => {
      createStudent(value, {
        onSuccess: () =>
          navigate({
            to: '/dashboard/students',
            search: { page: 0, q: '' },
          }),
      })
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
              to: '/dashboard/students',
              search: { page: 0, q: '' },
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold text-white">Create Student</h1>
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
              name="fullName"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.fullName),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="John Doe"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field
              name="email"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.email),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="john@example.com"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field
              name="username"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.username),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Username <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="johndoe"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field
              name="password"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.password),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field
              name="phoneNumber"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.phoneNumber),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">Phone Number</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="+6281234567890"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            <form.Field name="dateOfBirth">
              {(field) => (
                <Field>
                  <Label className="text-white/70">Date of Birth</Label>
                  <Input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
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
                  to: '/dashboard/students',
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
