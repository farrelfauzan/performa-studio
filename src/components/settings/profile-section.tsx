import { useRef, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { authApi, uploadToS3 } from '@/lib/api'
import type { SessionUser } from '@/server/auth'

export function ProfileSection({ user }: { user: SessionUser }) {
  const [name, setName] = useState(user?.name ?? '')
  const [email] = useState(user?.email ?? '')
  const [bio, setBio] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    user?.profilePicture ?? null,
  )
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const initials = (user?.name ?? '')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error('File too large. Max 2MB.')
      return
    }

    if (!file.type.startsWith('image/')) {
      toast.error('Only image files are allowed.')
      return
    }

    setUploading(true)
    try {
      const { data } = await authApi.getProfilePictureUploadUrl({
        filename: file.name,
        contentType: file.type,
      })

      await uploadToS3(data.uploadUrl, data.fields, file)

      await authApi.updateProfile({
        profilePictureUrl: data.publicUrl,
      })

      setAvatarUrl(data.publicUrl)
      toast.success('Profile picture updated')
    } catch {
      toast.error('Failed to upload profile picture')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await authApi.updateProfile({ fullName: name, bio })
      toast.success('Profile updated successfully')
    } catch {
      toast.error('Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card className="border-white/10 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-foreground">Profile</CardTitle>
        <CardDescription>
          Manage your public profile information.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={
                avatarUrl ??
                `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(user?.name ?? 'U')}`
              }
              alt={name}
            />
            <AvatarFallback className="bg-white/15 text-foreground text-lg">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/gif,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <Button
              variant="outline"
              size="sm"
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                  Uploading…
                </>
              ) : (
                'Change avatar'
              )}
            </Button>
            <p className="mt-1 text-xs text-muted-foreground">
              JPG, PNG or GIF. Max 2MB.
            </p>
          </div>
        </div>

        {/* Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Display name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-white/10 bg-white/5"
          />
        </div>

        {/* Email (read-only) */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            value={email}
            disabled
            className="border-white/10 bg-white/5 opacity-60"
          />
          <p className="text-xs text-muted-foreground">
            Contact support to change your email address.
          </p>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="border-white/10 bg-white/5 resize-none"
          />
          <p className="text-xs text-muted-foreground">
            Brief description for your profile. Max 160 characters.
          </p>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                Saving…
              </>
            ) : (
              'Save changes'
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
