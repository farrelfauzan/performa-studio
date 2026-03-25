import { useRef, useState } from 'react'
import { useForm } from '@tanstack/react-form'
import { Eye, EyeOff, Loader2, Camera } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Field, FieldError } from '@/components/ui/field'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { useCreateStudent } from '@/hooks/use-students'
import { studentApi, uploadToS3 } from '@/lib/api'
import { validateWithZod } from '@/lib/utils'
import { studentFieldSchemas } from '@/validations/student'

interface CreateStudentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateStudentDialog({
  open,
  onOpenChange,
}: CreateStudentDialogProps) {
  const { mutate: createStudent, isPending } = useCreateStudent()
  const [showPassword, setShowPassword] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [avatarFile, setAvatarFile] = useState<File | null>(null)
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      username: '',
      password: '',
      phoneNumber: '',
      dateOfBirth: '',
    },
    onSubmit: async ({ value }) => {
      let profilePictureUrl: string | undefined

      if (avatarFile) {
        setUploading(true)
        try {
          const { data } = await studentApi.getProfileUploadUrl({
            filename: avatarFile.name,
            contentType: avatarFile.type,
          })
          await uploadToS3(data.uploadUrl, data.fields, avatarFile)
          profilePictureUrl = data.publicUrl
        } catch {
          toast.error('Failed to upload photo')
          setUploading(false)
          return
        }
        setUploading(false)
      }

      createStudent(
        {
          ...value,
          profilePictureUrl,
        },
        {
          onSuccess: () => {
            resetForm()
            onOpenChange(false)
          },
        },
      )
    },
  })

  const resetForm = () => {
    form.reset()
    setShowPassword(false)
    setAvatarFile(null)
    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(null)
  }

  const handleAvatarSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    if (avatarPreview) URL.revokeObjectURL(avatarPreview)
    setAvatarPreview(URL.createObjectURL(file))
    setAvatarFile(file)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) resetForm()
        onOpenChange(v)
      }}
    >
      <DialogContent className="max-w-lg max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-white">Create Student</DialogTitle>
          <DialogDescription className="text-white/50">
            Add a new student to your class.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-5 overflow-y-auto py-4 px-6">
            {/* Profile Picture Upload */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <form.Field name="fullName">
                  {(field) => {
                    const initials = field.state.value
                      .split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase()
                    return (
                      <Avatar className="h-16 w-16">
                        <AvatarImage
                          src={
                            avatarPreview ??
                            (field.state.value
                              ? `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(field.state.value)}`
                              : undefined)
                          }
                          alt={field.state.value || 'Student'}
                        />
                        <AvatarFallback className="bg-white/15 text-white text-lg">
                          {initials || '?'}
                        </AvatarFallback>
                      </Avatar>
                    )
                  }}
                </form.Field>
                {uploading && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
              </div>
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/gif,image/webp"
                  className="hidden"
                  onChange={handleAvatarSelect}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={uploading}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Camera className="h-3.5 w-3.5" />
                  {avatarPreview ? 'Change photo' : 'Upload photo'}
                </Button>
                <p className="mt-1 text-xs text-white/40">
                  JPG, PNG or GIF. Max 2MB.
                </p>
              </div>
            </div>

            {/* Full Name */}
            <form.Field
              name="fullName"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.fullName),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Full Name <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="John Doe"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Email */}
            <form.Field
              name="email"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.email),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Email <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    type="email"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="john@example.com"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Username */}
            <form.Field
              name="username"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.username),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Username <span className="text-red-400">*</span>
                  </Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="johndoe"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Password */}
            <form.Field
              name="password"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.password),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">
                    Password <span className="text-red-400">*</span>
                  </Label>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={field.state.value}
                      onChange={(e) => field.handleChange(e.target.value)}
                      onBlur={field.handleBlur}
                      placeholder="••••••••"
                      className="pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/60"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Phone Number */}
            <form.Field
              name="phoneNumber"
              validators={{
                onChange: validateWithZod(studentFieldSchemas.phoneNumber),
              }}
            >
              {(field) => (
                <Field data-invalid={field.state.meta.errors.length > 0}>
                  <Label className="text-white/70">Phone Number</Label>
                  <Input
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                    placeholder="+6281234567890"
                  />
                  {field.state.meta.errors.length > 0 && (
                    <FieldError>{field.state.meta.errors[0]}</FieldError>
                  )}
                </Field>
              )}
            </form.Field>

            {/* Date of Birth */}
            <form.Field name="dateOfBirth">
              {(field) => (
                <Field>
                  <Label className="text-white/70">Date of Birth</Label>
                  <Input
                    type="date"
                    value={field.state.value}
                    onChange={(e) => field.handleChange(e.target.value)}
                    onBlur={field.handleBlur}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                resetForm()
                onOpenChange(false)
              }}
            >
              Cancel
            </Button>
            <form.Subscribe selector={(state) => state.isSubmitting}>
              {(isSubmitting) => (
                <Button
                  type="submit"
                  disabled={isSubmitting || isPending || uploading}
                >
                  {isSubmitting || isPending ? 'Creating...' : 'Create Student'}
                </Button>
              )}
            </form.Subscribe>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
