import { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const defaultPrefs = {
  emailNewComment: true,
  emailNewSubscriber: true,
  emailWeeklyDigest: false,
  pushNewComment: true,
  pushNewSubscriber: false,
  pushContentMilestone: true,
}

export function NotificationsSection() {
  const [prefs, setPrefs] = useState(defaultPrefs)

  const toggle = (key: keyof typeof defaultPrefs) => {
    setPrefs((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Notifications</CardTitle>
        <CardDescription>
          Choose what notifications you want to receive.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">
            Email notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="email-comment"
                className="text-sm text-muted-foreground font-normal"
              >
                New comment on your content
              </Label>
              <Switch
                id="email-comment"
                checked={prefs.emailNewComment}
                onCheckedChange={() => toggle('emailNewComment')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="email-subscriber"
                className="text-sm text-muted-foreground font-normal"
              >
                New subscriber
              </Label>
              <Switch
                id="email-subscriber"
                checked={prefs.emailNewSubscriber}
                onCheckedChange={() => toggle('emailNewSubscriber')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="email-digest"
                className="text-sm text-muted-foreground font-normal"
              >
                Weekly analytics digest
              </Label>
              <Switch
                id="email-digest"
                checked={prefs.emailWeeklyDigest}
                onCheckedChange={() => toggle('emailWeeklyDigest')}
              />
            </div>
          </div>
        </div>

        {/* Push notifications */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-foreground">
            Push notifications
          </h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label
                htmlFor="push-comment"
                className="text-sm text-muted-foreground font-normal"
              >
                New comment on your content
              </Label>
              <Switch
                id="push-comment"
                checked={prefs.pushNewComment}
                onCheckedChange={() => toggle('pushNewComment')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="push-subscriber"
                className="text-sm text-muted-foreground font-normal"
              >
                New subscriber
              </Label>
              <Switch
                id="push-subscriber"
                checked={prefs.pushNewSubscriber}
                onCheckedChange={() => toggle('pushNewSubscriber')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label
                htmlFor="push-milestone"
                className="text-sm text-muted-foreground font-normal"
              >
                Content milestone reached
              </Label>
              <Switch
                id="push-milestone"
                checked={prefs.pushContentMilestone}
                onCheckedChange={() => toggle('pushContentMilestone')}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={() => toast.success('Notification preferences saved')}
          >
            Save preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
