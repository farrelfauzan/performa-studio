import { useForm } from '@tanstack/react-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import { validateWithZod } from '@/lib/utils'
import { resetPasswordFn } from '@/server/auth'
import { useState } from 'react'
import { Link, useRouter } from '@tanstack/react-router'

const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^a-zA-Z0-9]/, 'Must contain at least one special character')

export function ResetPasswordForm({ token }: { token: string }) {
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const form = useForm({
    defaultValues: {
      newPassword: '',
      confirmPassword: '',
    },
    onSubmit: async ({ value }) => {
      setServerError(null)

      if (value.newPassword !== value.confirmPassword) {
        setServerError('Passwords do not match')
        return
      }

      const result = await resetPasswordFn({
        data: { token, newPassword: value.newPassword },
      })

      if (result.error) {
        setServerError(result.error)
        return
      }

      setSuccess(true)
    },
  })

  if (success) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-lg bg-green-500/15 border border-green-500/25 px-4 py-3 text-sm text-green-300">
          Your password has been reset successfully.
        </div>
        <Button
          onClick={() => router.navigate({ to: '/login' })}
          className="bg-white/20 hover:bg-white/30 border border-white/30 text-white backdrop-blur-sm cursor-pointer transition-all"
        >
          Go to Login
        </Button>
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
        name="newPassword"
        validators={{
          onChange: validateWithZod(passwordSchema),
        }}
      >
        {(field) => (
          <Field data-invalid={field.state.meta.errors.length > 0}>
            <Label htmlFor="newPassword" className="text-white/90">
              New Password
            </Label>
            <Input
              id="newPassword"
              type="password"
              placeholder="Enter new password"
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
        name="confirmPassword"
        validators={{
          onChange: validateWithZod(passwordSchema),
        }}
      >
        {(field) => (
          <Field data-invalid={field.state.meta.errors.length > 0}>
            <Label htmlFor="confirmPassword" className="text-white/90">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Confirm new password"
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
            {isSubmitting ? 'Resetting...' : 'Reset Password'}
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
