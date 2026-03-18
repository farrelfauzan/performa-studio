import { Check, ChevronLeft, ChevronRight, Loader2, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'

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
    <div className="space-y-6">
      {/* Step indicator */}
      <Card className="bg-card/50 backdrop-blur-xl ring-white/12">
        <CardContent>
          <nav aria-label="Progress">
            <ol className="flex items-center gap-0">
              {steps.map((step, index) => {
                const isCompleted = index < currentStep
                const isCurrent = index === currentStep
                const isClickable = index < currentStep

                return (
                  <li
                    key={step.id}
                    className={cn(
                      'relative flex items-center',
                      index < steps.length - 1 && 'flex-1',
                    )}
                  >
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <button
                            type="button"
                            onClick={() => isClickable && onStepChange(index)}
                            disabled={!isClickable && !isCurrent}
                            className={cn(
                              'flex items-center gap-3 rounded-lg px-2 py-1.5 transition-colors',
                              isClickable && 'cursor-pointer hover:bg-white/5',
                              !isClickable && !isCurrent && 'cursor-default',
                            )}
                          >
                            <span
                              className={cn(
                                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium transition-all',
                                isCompleted &&
                                  'border-primary bg-primary text-primary-foreground',
                                isCurrent &&
                                  'border-primary bg-primary/20 text-primary ring-[3px] ring-primary/25',
                                !isCompleted &&
                                  !isCurrent &&
                                  'border-border text-muted-foreground',
                              )}
                            >
                              {isCompleted ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </span>
                            <div className="hidden sm:block text-left">
                              <p
                                className={cn(
                                  'text-sm font-medium leading-tight',
                                  isCurrent && 'text-foreground',
                                  isCompleted && 'text-muted-foreground',
                                  !isCompleted &&
                                    !isCurrent &&
                                    'text-muted-foreground/50',
                                )}
                              >
                                {step.title}
                              </p>
                            </div>
                          </button>
                        </TooltipTrigger>
                        {step.description && (
                          <TooltipContent side="bottom">
                            {step.description}
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>

                    {/* Connector */}
                    {index < steps.length - 1 && (
                      <div className="mx-2 hidden flex-1 sm:block">
                        <Separator
                          className={cn(
                            'transition-colors',
                            isCompleted ? 'bg-primary' : 'bg-border',
                          )}
                        />
                      </div>
                    )}
                  </li>
                )
              })}
            </ol>
          </nav>
        </CardContent>
      </Card>

      {/* Step content */}
      <Card className="bg-card/50 backdrop-blur-xl ring-white/12">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-foreground">
                {steps[currentStep]?.title}
              </CardTitle>
              <Badge variant="secondary" className="text-[10px]">
                Step {currentStep + 1} of {steps.length}
              </Badge>
            </div>
          </div>
          {steps[currentStep]?.description && (
            <CardDescription>{steps[currentStep].description}</CardDescription>
          )}
        </CardHeader>
        <Separator className="bg-border/50" />
        <CardContent>{children}</CardContent>
        <Separator className="bg-border/50" />
        <CardFooter className="justify-between">
          {onSaveDraft ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onSaveDraft}
              disabled={isSaving || isSubmitting}
            >
              {isSaving ? (
                <Loader2
                  className="h-4 w-4 animate-spin"
                  data-icon="inline-start"
                />
              ) : (
                <Save className="h-4 w-4" data-icon="inline-start" />
              )}
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onStepChange(currentStep - 1)}
              disabled={isFirst}
              className={cn(isFirst && 'invisible')}
            >
              <ChevronLeft className="h-4 w-4" data-icon="inline-start" />
              Back
            </Button>

            {isLast ? (
              <Button
                size="sm"
                onClick={handleFinish}
                disabled={!canProceed || isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2
                    className="h-4 w-4 animate-spin"
                    data-icon="inline-start"
                  />
                ) : null}
                {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
              </Button>
            ) : (
              <Button size="sm" onClick={handleNext} disabled={!canProceed}>
                Continue
                <ChevronRight className="h-4 w-4" data-icon="inline-end" />
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
