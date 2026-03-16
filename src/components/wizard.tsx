import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export type WizardStep = {
  id: string
  title: string
  description?: string
}

type WizardProps = {
  steps: WizardStep[]
  currentStep: number
  onStepChange: (step: number) => void
  children: React.ReactNode
  onFinish?: () => void
  onSaveDraft?: () => void
  onBeforeNext?: (currentStep: number) => boolean
  canProceed?: boolean
  isSubmitting?: boolean
  isSaving?: boolean
}

export function Wizard({
  steps,
  currentStep,
  onStepChange,
  children,
  onFinish,
  onSaveDraft,
  onBeforeNext,
  canProceed = true,
  isSubmitting = false,
  isSaving = false,
}: WizardProps) {
  const isFirst = currentStep === 0
  const isLast = currentStep === steps.length - 1

  const handleNext = () => {
    if (onBeforeNext && !onBeforeNext(currentStep)) return
    onStepChange(currentStep + 1)
  }

  const handleFinish = () => {
    if (onBeforeNext && !onBeforeNext(currentStep)) return
    onFinish?.()
  }

  return (
    <div className="space-y-8">
      {/* Step indicator */}
      <nav aria-label="Progress">
        <ol className="flex items-center">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep
            const isCurrent = index === currentStep

            return (
              <li
                key={step.id}
                className={cn(
                  'relative flex items-center',
                  index < steps.length - 1 && 'flex-1',
                )}
              >
                <button
                  type="button"
                  onClick={() => index < currentStep && onStepChange(index)}
                  disabled={index > currentStep}
                  className="flex items-center gap-3 group"
                >
                  <span
                    className={cn(
                      'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-colors',
                      isCompleted && 'border-blue-500 bg-blue-500 text-white',
                      isCurrent &&
                        'border-blue-400 bg-blue-500/20 text-blue-400',
                      !isCompleted &&
                        !isCurrent &&
                        'border-white/20 text-white/30',
                    )}
                  >
                    {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                  </span>
                  <div className="hidden sm:block text-left">
                    <p
                      className={cn(
                        'text-sm font-medium',
                        isCurrent ? 'text-white' : 'text-white/40',
                        isCompleted && 'text-white/70',
                      )}
                    >
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="text-xs text-white/30">
                        {step.description}
                      </p>
                    )}
                  </div>
                </button>

                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="mx-4 hidden flex-1 sm:block">
                    <div
                      className={cn(
                        'h-px w-full',
                        isCompleted ? 'bg-blue-500' : 'bg-white/12',
                      )}
                    />
                  </div>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* Step content */}
      <Card className="bg-white/5 backdrop-blur-xl ring-white/12">
        <CardContent>{children}</CardContent>
      </Card>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between">
        {onSaveDraft ? (
          <Button
            variant="outline"
            onClick={onSaveDraft}
            disabled={isSaving || isSubmitting}
          >
            {isSaving ? 'Saving...' : 'Save as Draft'}
          </Button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => onStepChange(currentStep - 1)}
            disabled={isFirst}
            className={cn(isFirst && 'invisible')}
          >
            Back
          </Button>

          {isLast ? (
            <Button
              onClick={handleFinish}
              disabled={!canProceed || isSubmitting}
            >
              {isSubmitting ? 'Publishing...' : 'Publish Content'}
            </Button>
          ) : (
            <Button onClick={handleNext} disabled={!canProceed}>
              Continue
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
