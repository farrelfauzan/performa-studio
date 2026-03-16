import { useState } from 'react'
import {
  Plus,
  Trash2,
  Info,
  Tv,
  Award,
  Zap,
  MessageSquare,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const MAX_TIERS = 3

const FEATURES = [
  {
    key: 'adFree' as const,
    label: 'Ad-free viewing',
    description: 'Remove all ads for subscribers on this tier',
    icon: Tv,
  },
  {
    key: 'badge' as const,
    label: 'Exclusive badge',
    description: 'Display a unique badge next to subscriber name',
    icon: Award,
  },
  {
    key: 'earlyAccess' as const,
    label: 'Early access to content',
    description: 'Let subscribers see new content before everyone else',
    icon: Zap,
  },
  {
    key: 'directMessage' as const,
    label: 'Direct messaging',
    description: 'Allow subscribers to send you direct messages',
    icon: MessageSquare,
  },
]

export type TierFormData = {
  id?: number
  name: string
  price: string
  description: string
  adFree: boolean
  badge: boolean
  earlyAccess: boolean
  directMessage: boolean
}

const EMPTY_TIER: TierFormData = {
  name: '',
  price: '',
  description: '',
  adFree: false,
  badge: false,
  earlyAccess: false,
  directMessage: false,
}

type SubscriptionTierFormProps = {
  mode: 'create' | 'edit'
  initialTiers?: TierFormData[]
  onSubmit: (tiers: TierFormData[]) => void
  isSubmitting?: boolean
}

export function SubscriptionTierForm({
  mode,
  initialTiers,
  onSubmit,
  isSubmitting = false,
}: SubscriptionTierFormProps) {
  const [tiers, setTiers] = useState<TierFormData[]>(
    initialTiers ?? [{ ...EMPTY_TIER }],
  )
  const [errors, setErrors] = useState<Record<string, string>>({})

  function updateTier(
    index: number,
    field: keyof TierFormData,
    value: string | boolean,
  ) {
    setTiers((prev) =>
      prev.map((t, i) => (i === index ? { ...t, [field]: value } : t)),
    )
    setErrors((prev) => {
      const next = { ...prev }
      delete next[`${index}.${field}`]
      return next
    })
  }

  function addTier() {
    if (tiers.length >= MAX_TIERS) return
    setTiers((prev) => [...prev, { ...EMPTY_TIER }])
  }

  function removeTier(index: number) {
    if (tiers.length <= 1) return
    setTiers((prev) => prev.filter((_, i) => i !== index))
    setErrors({})
  }

  function validate(): boolean {
    const newErrors: Record<string, string> = {}
    tiers.forEach((tier, i) => {
      if (!tier.name.trim()) newErrors[`${i}.name`] = 'Name is required'
      const price = Number(tier.price)
      if (tier.price === '' || isNaN(price))
        newErrors[`${i}.price`] = 'Price is required'
      else if (price < 0) newErrors[`${i}.price`] = 'Price must be 0 or more'
      if (!tier.description.trim())
        newErrors[`${i}.description`] = 'Description is required'
    })
    const names = tiers.map((t) => t.name.trim().toLowerCase())
    names.forEach((name, i) => {
      if (name && names.indexOf(name) !== i) {
        newErrors[`${i}.name`] = 'Tier names must be unique'
      }
    })
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    onSubmit(tiers)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Approval notice */}
      <div className="flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
        <Info className="mt-0.5 size-4 shrink-0 text-amber-400" />
        <div className="text-sm">
          <p className="font-medium text-amber-400">Admin Approval Required</p>
          <p className="mt-0.5 text-muted-foreground">
            {mode === 'create'
              ? 'New subscription tiers will be reviewed by the Performa admin team before going live.'
              : 'Any changes to subscription tiers will require re-approval from the Performa admin team.'}
          </p>
        </div>
      </div>

      {/* Tier cards */}
      <div className="space-y-4">
        {tiers.map((tier, index) => (
          <Card key={index} size="sm" className="bg-card/50 backdrop-blur-xl">
            <CardHeader>
              <CardTitle className="text-sm font-medium">
                Tier {index + 1}
              </CardTitle>
              {tiers.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-7 gap-1 px-2 text-xs text-muted-foreground hover:text-red-400"
                  onClick={() => removeTier(index)}
                >
                  <Trash2 className="size-3.5" />
                  Remove
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-5">
              {/* Name + Price row */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`tier-name-${index}`}>Tier Name</Label>
                  <Input
                    id={`tier-name-${index}`}
                    placeholder="e.g. Free, Supporter, VIP"
                    value={tier.name}
                    onChange={(e) => updateTier(index, 'name', e.target.value)}
                    aria-invalid={!!errors[`${index}.name`]}
                  />
                  {errors[`${index}.name`] && (
                    <p className="text-xs text-destructive">
                      {errors[`${index}.name`]}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor={`tier-price-${index}`}>Price ($/month)</Label>
                  <Input
                    id={`tier-price-${index}`}
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={tier.price}
                    onChange={(e) => updateTier(index, 'price', e.target.value)}
                    aria-invalid={!!errors[`${index}.price`]}
                  />
                  {errors[`${index}.price`] && (
                    <p className="text-xs text-destructive">
                      {errors[`${index}.price`]}
                    </p>
                  )}
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor={`tier-desc-${index}`}>Description</Label>
                <Textarea
                  id={`tier-desc-${index}`}
                  placeholder="Describe what this tier offers..."
                  value={tier.description}
                  onChange={(e) =>
                    updateTier(index, 'description', e.target.value)
                  }
                  aria-invalid={!!errors[`${index}.description`]}
                />
                {errors[`${index}.description`] && (
                  <p className="text-xs text-destructive">
                    {errors[`${index}.description`]}
                  </p>
                )}
              </div>

              {/* Features */}
              <div className="space-y-3">
                <Label>Features</Label>
                <div className="space-y-3">
                  {FEATURES.map((feature) => (
                    <div
                      key={feature.key}
                      className="flex items-center justify-between rounded-lg border border-border/50 bg-card/30 px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <feature.icon className="size-4 text-muted-foreground" />
                        <div>
                          <p className="text-sm font-medium">{feature.label}</p>
                          <p className="text-xs text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                      <Switch
                        checked={tier[feature.key]}
                        onCheckedChange={(checked: boolean) =>
                          updateTier(index, feature.key, checked)
                        }
                      />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add tier button */}
      {tiers.length < MAX_TIERS && (
        <Button
          type="button"
          variant="outline"
          className="w-full gap-2 border-dashed"
          onClick={addTier}
        >
          <Plus className="size-4" />
          Add Tier ({tiers.length}/{MAX_TIERS})
        </Button>
      )}

      {/* Submit */}
      <div className="flex items-center justify-end gap-3">
        <Button type="submit" disabled={isSubmitting} className="gap-2">
          {isSubmitting && <Loader2 className="size-4 animate-spin" />}
          {mode === 'create'
            ? 'Submit for Approval'
            : 'Save & Submit for Approval'}
        </Button>
      </div>
    </form>
  )
}
