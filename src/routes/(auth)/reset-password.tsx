import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'
import { ResetPasswordForm } from '@/components/reset-password-form'

const resetPasswordSearchSchema = z.object({
  token: z.string().catch(''),
})

export const Route = createFileRoute('/(auth)/reset-password')({
  component: ResetPasswordPage,
  validateSearch: resetPasswordSearchSchema,
  ssr: false,
})

function ResetPasswordPage() {
  const { token } = Route.useSearch()

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 p-8">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-purple-500/5 rounded-full blur-3xl" />
        </div>

        <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-white mb-2">Performa</h1>
          </div>
          <div className="rounded-lg bg-red-500/15 border border-red-500/25 px-4 py-3 text-sm text-red-300 text-center">
            Invalid or missing reset token. Please request a new password reset.
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 p-8">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      {/* Glass card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Performa</h1>
          <p className="text-white/70">Set your new password</p>
        </div>
        <ResetPasswordForm token={token} />
      </div>
    </div>
  )
}
