import { Link, useMatchRoute, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Clapperboard,
  BarChart3,
  MessagesSquare,
  LogOut,
} from 'lucide-react'
import { logoutFn } from '@/server/auth'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar'

const sidebarItems = [
  {
    label: 'Dashboard',
    to: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Studio',
    to: '/dashboard/studio',
    icon: Clapperboard,
  },
  {
    label: 'Analytics',
    to: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    label: 'Community',
    to: '/dashboard/community',
    icon: MessagesSquare,
  },
] as const

export function DashboardSidebar() {
  const matchRoute = useMatchRoute()
  const router = useRouter()

  return (
    <Sidebar
      collapsible="icon"
      className="border-white/12 **:data-[slot=sidebar-inner]:bg-white/[0.07] **:data-[slot=sidebar-inner]:backdrop-blur-xl"
    >
      {/* Logo / Brand */}
      <SidebarHeader className="border-b border-white/8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/dashboard">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/15 backdrop-blur-sm">
                  <span className="text-sm font-bold text-white">P</span>
                </div>
                <span className="text-lg font-semibold text-white tracking-tight truncate">
                  Performa
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-white/40 uppercase text-xs tracking-wider">
            Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((item) => {
                const isActive = !!matchRoute({ to: item.to, fuzzy: false })

                return (
                  <SidebarMenuItem key={item.to}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.label}
                      className="text-white/60 hover:bg-white/8 hover:text-white/90 data-[active=true]:bg-white/15 data-[active=true]:text-white data-[active=true]:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
                    >
                      <Link to={item.to} search={{} as any}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Bottom section */}
      <SidebarFooter className="border-t border-white/8">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={async () => {
                await logoutFn()
                router.navigate({ to: '/login' })
              }}
              tooltip="Sign out"
              className="text-white/50 hover:bg-white/8 hover:text-white/80 cursor-pointer"
            >
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
