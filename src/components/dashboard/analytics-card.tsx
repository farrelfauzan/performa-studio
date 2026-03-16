import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

type AnalyticsCardProps = {
  title: string
  value?: string
  change?: number
  isLoading: boolean
  children: React.ReactNode
}

export function AnalyticsCard({
  title,
  value,
  change,
  isLoading,
  children,
}: AnalyticsCardProps) {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {title}
            </CardTitle>
            {isLoading ? (
              <Skeleton className="mt-2 h-8 w-24" />
            ) : (
              <p className="mt-1 text-2xl font-semibold">{value}</p>
            )}
          </div>
          {!isLoading && change !== undefined && (
            <Badge
              className={`text-xs ${
                change >= 0
                  ? 'bg-green-500/15 text-green-400 border-transparent'
                  : 'bg-red-500/15 text-red-400 border-transparent'
              }`}
            >
              {change >= 0 ? '+' : ''}
              {change}%
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-50">
          {isLoading ? <Skeleton className="h-full w-full" /> : children}
        </div>
      </CardContent>
    </Card>
  )
}

type StatCardProps = {
  label: string
  value?: string
  change?: number
  isLoading: boolean
}

export function StatCard({ label, value, change, isLoading }: StatCardProps) {
  return (
    <Card size="sm" className="bg-card/50 backdrop-blur-xl">
      <CardContent>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </p>
        {isLoading ? (
          <Skeleton className="mt-2 h-8 w-20" />
        ) : (
          <div className="mt-1 flex items-end gap-2">
            <p className="text-2xl font-semibold">{value}</p>
            {change !== undefined && (
              <span
                className={`mb-1 text-xs font-medium ${
                  change >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {change >= 0 ? '+' : ''}
                {change}%
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
