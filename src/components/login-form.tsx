import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import { useRouter } from '@tanstack/react-router'
import { validateWithZod } from '@/lib/utils'
import { loginFn } from '@/server/auth'
import { useState } from 'react'
import { useAuthStore } from '@/stores/auth-store'

const emailSchema = z.email({
  error: 'Invalid email address',
})
const passwordSchema = z
  .string()
  .min(6, 'Password must be at least 6 characters')

export function LoginForm() {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const { setAuth } = useAuthStore()

  const form = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const result = await loginFn({ data: value })

      if (result.error) {
        setServerError(result.error)
        return
      }

      if (result.user && result.accessToken) {
        setAuth(result.accessToken, result.user)
        router.navigate({ to: '/dashboard' })
      }

    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        e.stopPropagation()
        form.handleSubmit()
      }}
      className="flex flex-col gap-6"
    >
      {serverError && (
        <div className="rounded-lg bg-red-500/15 border border-red-500/25 px-4 py-3 text-sm text-red-300">
          {serverError}
        </div>
      )}

      <form.Field
        name="email"
        validators={{
          onChange: validateWithZod(emailSchema),
        }}
      >
        {(field) => (
          <Field data-invalid={field.state.meta.errors.length > 0}>
            <Label htmlFor="email" className="text-white/90">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
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
          onChange: validateWithZod(passwordSchema),
        }}
      >
        {(field) => (
          <Field data-invalid={field.state.meta.errors.length > 0}>
            <Label htmlFor="password" className="text-white/90">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={field.state.value}
              onChange={(e) => field.handleChange(e.target.value)}
              onBlur={field.handleBlur}
              className="bg-white/10 border-white/20 text-white placeholder:text-white/50 backdrop-blur-sm"
            />
            {field.state.meta.errors.length > 0 && (
              <FieldError>{field.state.meta.errors[0]}</FieldError>
            )}
          </Field>
        )}
      </form.Field>

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm cursor-pointer transition-all"
          >
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </Button>
        )}
      </form.Subscribe>
    </form>
  )
}
