import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'
import { DashboardSidebar } from '@/components/dashboard-sidebar'
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { getSession } from '@/server/auth'

export const Route = createFileRoute('/(dashboard)/dashboard')({
  component: DashboardLayout,
  beforeLoad: async ({ location }) => {
    const user = await getSession()
    if (!user) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      })
    }
    return { user }
  },
  loader: async () => {
    const user = await getSession()
    return { user: user! }
  },
})

function DashboardLayout() {
  const { user } = Route.useLoaderData()

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-950 via-blue-950 to-indigo-950">
      {/* Decorative background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-125 h-125 bg-blue-500/8 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-indigo-500/8 rounded-full blur-3xl" />
        <div className="absolute top-2/3 left-2/3 w-80 h-80 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <SidebarProvider>
        <DashboardSidebar user={user} />
        <SidebarInset className="bg-transparent">
          {/* Top bar */}
          <header className="flex h-14 items-center gap-2 border-b border-white/8 px-4">
            <SidebarTrigger className="text-white/60 hover:text-white hover:bg-white/8" />
          </header>

          {/* Page content */}
          <div className="relative p-6">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  )
}
