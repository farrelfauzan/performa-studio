import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import { validateWithZod } from '@/lib/utils'
import { requestPasswordResetFn } from '@/server/auth'
import { useState } from 'react'
import { Link } from '@tanstack/react-router'

const emailSchema = z.email({
  error: 'Invalid email address',
})

export function ForgotPasswordForm() {
  const [serverError, setServerError] = useState<string | null>(null)
  const [resetToken, setResetToken] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: '',
    },
    onSubmit: async ({ value }) => {
      setServerError(null)
      const result = await requestPasswordResetFn({ data: value })

      if (result.error) {
        setServerError(result.error)
        return
      }

      if (result.resetToken) {
        setResetToken(result.resetToken)
      }
    },
  })

  if (resetToken) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-green-500/15 border border-green-500/25 px-4 py-3 text-sm text-green-300">
          A password reset link has been generated. Use the link below to reset
          your password.
        </div>
        <Link
          to="/reset-password"
          search={{ token: resetToken }}
          className="text-center text-sm text-blue-300 hover:text-blue-200 underline underline-offset-4 transition-colors"
        >
          Go to Reset Password
        </Link>
        <Link
          to="/login"
          className="text-center text-sm text-white/60 hover:text-white/80 transition-colors"
        >
          Back to login
        </Link>
      </div>
    )
  }

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

      <form.Subscribe selector={(state) => state.isSubmitting}>
        {(isSubmitting) => (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm cursor-pointer transition-all"
          >
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
        )}
      </form.Subscribe>

      <Link
        to="/login"
        className="text-center text-sm text-white/60 hover:text-white/80 transition-colors"
      >
        Back to login
      </Link>
    </form>
  )
}
