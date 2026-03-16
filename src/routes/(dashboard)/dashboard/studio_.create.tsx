import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { Wizard, type WizardStep } from '@/components/wizard'
import { Button } from '@/components/ui/button'
import { useStudioStore } from '@/stores/studio-store'
import { StepGeneralDetails } from '@/components/studio/step-general-details'
import { StepUploadMedia } from '@/components/studio/step-upload-media'
import { StepLearningSections } from '@/components/studio/step-learning-sections'
import { StepFinalization } from '@/components/studio/step-finalization'
import { useEffect } from 'react'

// ─── Wizard Steps Config ────────────────────────────────────────────────

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'details',
    title: 'General Details',
    description: 'Title, category & info',
  },
  {
    id: 'media',
    title: 'Upload Media',
    description: 'Preview video & thumbnail',
  },
  {
    id: 'sections',
    title: 'Learning Sections',
    description: 'Organize your content',
  },
  {
    id: 'finalization',
    title: 'Finalization',
    description: 'Review & publish',
  },
]

// ─── Route ──────────────────────────────────────────────────────────────

export const Route = createFileRoute('/(dashboard)/dashboard/studio_/create')({
  component: CreateContentPage,
})

// ─── Page Component ─────────────────────────────────────────────────────

function CreateContentPage() {
  const navigate = useNavigate()
  const {
    step,
    setStep,
    isSubmitting,
    isSaving,
    setSubmitting,
    setSaving,
    validateStep,
    clearErrors,
    reset,
  } = useStudioStore()

  // Reset store when unmounting
  useEffect(() => {
    return () => reset()
  }, [reset])

  const handleBeforeNext = (currentStep: number) => {
    return validateStep(currentStep)
  }

  const handleStepChange = (newStep: number) => {
    // Allow going back without validation
    if (newStep < step) {
      clearErrors()
      setStep(newStep)
      return
    }
    // Going forward is handled by Wizard's onBeforeNext
    setStep(newStep)
  }

  const handleSaveDraft = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    toast.success('Draft saved successfully!')
    setSaving(false)
  }

  const handleFinish = async () => {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    toast.success('Content published successfully!')
    setSubmitting(false)
    navigate({
      to: '/dashboard/studio',
      search: { view: 'grid', page: 0, q: '' },
    })
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex items-center gap-4">
        <Button
          variant="outline"
          size="icon-sm"
          onClick={() =>
            navigate({
              to: '/dashboard/studio',
              search: { view: 'grid', page: 0, q: '' },
            })
          }
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-white">Create Content</h1>
          <p className="mt-0.5 text-sm text-white/50">
            Set up your new learning content step by step
          </p>
        </div>
      </div>

      <Wizard
        steps={WIZARD_STEPS}
        currentStep={step}
        onStepChange={handleStepChange}
        onBeforeNext={handleBeforeNext}
        onFinish={handleFinish}
        onSaveDraft={handleSaveDraft}
        isSubmitting={isSubmitting}
        isSaving={isSaving}
      >
        {step === 0 && <StepGeneralDetails />}
        {step === 1 && <StepUploadMedia />}
        {step === 2 && <StepLearningSections />}
        {step === 3 && <StepFinalization />}
      </Wizard>
    </div>
  )
}
