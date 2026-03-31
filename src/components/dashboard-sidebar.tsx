import { Link, useMatchRoute, useRouter } from '@tanstack/react-router'
import {
  LayoutDashboard,
  Clapperboard,
  BarChart3,
  MessagesSquare,
  LogOut,
  Settings,
  ChevronsUpDown,
  GraduationCap,
  ClipboardList,
  FileQuestion,
  School,
} from 'lucide-react'
import { logoutFn } from '@/server/auth'
import { useAuthStore } from '@/stores/auth-store'
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import type { SessionUser } from '@/server/auth'
import { Button } from './ui/button'

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
    label: 'Students',
    to: '/dashboard/students',
    icon: GraduationCap,
  },
  {
    label: 'Classes',
    to: '/dashboard/classes',
    icon: School,
  },
  {
    label: 'Assignments',
    to: '/dashboard/assignments',
    icon: ClipboardList,
  },
  {
    label: 'Quizzes',
    to: '/dashboard/quizzes',
    icon: FileQuestion,
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

const FALLBACK_USER: SessionUser = {
  id: '0',
  email: 'guest@performa.io',
  name: 'Guest User',
  role: 'user',
}

export function DashboardSidebar({ user: userProp }: { user: SessionUser }) {
  const user = userProp ?? FALLBACK_USER
  const matchRoute = useMatchRoute()
  const router = useRouter()

  const initials = (user?.name ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

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

      {/* Bottom section — Profile */}
      <SidebarFooter className="border-t border-white/8">
        <SidebarMenu>
          <SidebarMenuItem>
            <Popover>
              <PopoverTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  tooltip={user.name}
                  className="text-white/70 hover:bg-white/8 hover:text-white cursor-pointer"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-white/15 text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium text-white">
                      {user.name}
                    </span>
                    <span className="truncate text-xs text-white/50">
                      {user.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4 text-white/40" />
                </SidebarMenuButton>
              </PopoverTrigger>
              <PopoverContent
                side="top"
                align="start"
                className="w-56 rounded-lg border-white/12 bg-slate-900/95 p-1 backdrop-blur-xl"
              >
                {/* User info header */}
                <div className="flex items-center gap-3 px-3 py-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage
                      src={`https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user.name)}`}
                      alt={user.name}
                    />
                    <AvatarFallback className="bg-white/15 text-white text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid text-sm leading-tight">
                    <span className="font-medium text-white">{user.name}</span>
                    <span className="text-xs text-white/50">{user.email}</span>
                  </div>
                </div>

                <Separator className=" bg-white/8" />

                {/* Settings */}
                <Link
                  to="/dashboard/settings"
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/70 hover:bg-white/8 hover:text-white transition-colors"
                >
                  <Settings className="size-4" />
                  <span>Settings</span>
                </Link>

                <Separator className=" bg-white/8" />

                {/* Sign out */}
                <Button
                  onClick={async () => {
                    await logoutFn()
                    useAuthStore.getState().logout()
                    router.navigate({ to: '/login' })
                  }}
                  // className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm text-white/50 hover:bg-white/8 hover:text-white/80 transition-colors"
                  className="rounded-md hover:text-white/80 cursor-pointer w-full text-white"
                  variant="destructive"
                >
                  <LogOut className="size-4" />
                  <span>Sign out</span>
                </Button>
              </PopoverContent>
            </Popover>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}
