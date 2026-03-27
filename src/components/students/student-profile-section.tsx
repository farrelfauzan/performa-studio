import { Calendar, Phone, User, Clock } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { useStudent } from '@/hooks/use-students'

const STATUS_STYLES: Record<string, string> = {
  ACTIVE: 'bg-green-500/15 text-green-400 border-transparent',
  INACTIVE: 'bg-gray-500/15 text-gray-400 border-transparent',
}

export function StudentProfileSection({ studentId }: { studentId: string }) {
  const { data: studentData, isLoading } = useStudent(studentId)
  const student = studentData?.data ?? null

  return (
    <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
      <CardContent className="pt-6">
        {isLoading ? (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start animate-pulse">
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full bg-white/10" />
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-5 w-36 rounded bg-white/10" />
                  <div className="h-5 w-16 rounded-full bg-white/8" />
                </div>
                <div className="h-3.5 w-24 rounded bg-white/5" />
                <div className="h-3.5 w-56 rounded bg-white/5" />
              </div>
            </div>
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center gap-2.5 rounded-lg bg-white/3 px-3 py-2.5">
                  <div className="h-8 w-8 rounded-full bg-white/8" />
                  <div className="space-y-1.5">
                    <div className="h-2.5 w-12 rounded bg-white/8" />
                    <div className="h-3.5 w-24 rounded bg-white/10" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : !student ? (
          <p className="py-4 text-center text-sm text-white/40">No profile data</p>
        ) : (
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
            {/* Avatar & name */}
            <div className="flex items-center gap-4">
              <Avatar className="h-20 w-20">
                {student.profilePictureUrl && (
                  <AvatarImage
                    src={student.profilePictureUrl}
                    alt={student.fullName}
                  />
                )}
                <AvatarFallback className="bg-white/10 text-xl">
                  <User className="h-10 w-10 text-white/50" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {student.fullName}
                  </h2>
                  <Badge
                    className={`text-[11px] py-2 capitalize ${STATUS_STYLES[student.active] ?? STATUS_STYLES.INACTIVE}`}
                  >
                    {student.active.toLowerCase()}
                  </Badge>
                </div>
                <p className="mt-0.5 text-sm font-mono text-white/40">
                  {student.uniqueId}
                </p>
                {student.bio && (
                  <p className="mt-1 max-w-md text-sm text-white/50">
                    {student.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Info grid */}
            <div className="grid flex-1 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {student.phoneNumber && (
                <div className="flex items-center gap-2.5 rounded-lg bg-white/3 px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
                    <Phone className="h-3.5 w-3.5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">
                      Phone
                    </p>
                    <p className="text-sm text-white/70">{student.phoneNumber}</p>
                  </div>
                </div>
              )}

              {student.dateOfBirth && (
                <div className="flex items-center gap-2.5 rounded-lg bg-white/3 px-3 py-2.5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
                    <Calendar className="h-3.5 w-3.5 text-white/50" />
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-white/30">
                      Date of Birth
                    </p>
                    <p className="text-sm text-white/70">
                      {new Date(student.dateOfBirth).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex items-center gap-2.5 rounded-lg bg-white/3 px-3 py-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/8">
                  <Clock className="h-3.5 w-3.5 text-white/50" />
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-white/30">
                    Joined
                  </p>
                  <p className="text-sm text-white/70">
                    {new Date(student.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
