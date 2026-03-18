import { createFileRoute } from '@tanstack/react-router'
import { getSession } from '@/server/auth'
import { ProfileSection } from '@/components/settings/profile-section'
import { AccountSection } from '@/components/settings/account-section'
import { NotificationsSection } from '@/components/settings/notifications-section'

export const Route = createFileRoute('/(dashboard)/dashboard/settings')({
  component: SettingsPage,
  loader: async () => {
    const user = await getSession()
    return { user: user! }
  },
})

function SettingsPage() {
  const { user } = Route.useLoaderData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <ProfileSection user={user} />
      <AccountSection />
      <NotificationsSection />
    </div>
  )
}
