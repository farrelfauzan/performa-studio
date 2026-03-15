import { Link } from '@tanstack/react-router'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Home, X } from 'lucide-react'

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950 p-8">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      {/* Glass card */}
      <div className="relative w-full max-w-md backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-10 text-center">
        {/* Animated X icon */}
        <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-sm animate-[bounce_2s_ease-in-out_infinite]">
          <X className="h-12 w-12 text-white/70" strokeWidth={2.5} />
        </div>

        {/* Title */}
        <h1 className="text-6xl font-bold text-white mb-2 animate-[fadeInUp_0.5s_ease-out]">
          404
        </h1>
        <p className="text-lg font-medium text-white/80 mb-2 animate-[fadeInUp_0.6s_ease-out]">
          Page not found
        </p>

        {/* Message */}
        <div className="text-sm text-white/50 mb-8 animate-[fadeInUp_0.7s_ease-out]">
          {children || (
            <p>
              The page you&apos;re looking for doesn&apos;t exist or has been
              moved.
            </p>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex items-center justify-center gap-3 animate-[fadeInUp_0.8s_ease-out]">
          <Button
            onClick={() => window.history.back()}
            variant="ghost"
            className="bg-white/10 border border-white/20 text-white hover:bg-white/20 hover:text-white backdrop-blur-sm cursor-pointer"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Go back
          </Button>
          <Button
            asChild
            className="bg-white/20 border border-white/25 text-white hover:bg-white/30 hover:text-white backdrop-blur-sm"
          >
            <Link to="/dashboard">
              <Home className="mr-1.5 h-4 w-4" />
              Home
            </Link>
          </Button>
        </div>
      </div>

      {/* Keyframe styles */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
