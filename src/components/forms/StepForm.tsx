import { useState, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Stepper } from "@/components/ui/stepper"
import { Card, CardContent } from "@/components/ui/card"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

export interface Step {
  title: string
  description?: string
  content: ReactNode
  validation?: () => boolean | Promise<boolean>
}

interface StepFormProps {
  steps: Step[]
  onSubmit: () => void | Promise<void>
  onCancel?: () => void
  isLoading?: boolean
  submitLabel?: string
  className?: string
}

export function StepForm({
  steps,
  onSubmit,
  onCancel,
  isLoading = false,
  submitLabel = "Finalizar",
  className,
}: StepFormProps) {
  const [currentStep, setCurrentStep] = useState(0)
  const [errors, setErrors] = useState<Record<number, boolean>>({})

  const stepTitles = steps.map((step) => step.title)
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = async () => {
    const currentStepData = steps[currentStep]

    // Validar passo atual se houver validação
    if (currentStepData.validation) {
      const isValid = await currentStepData.validation()
      if (!isValid) {
        setErrors({ ...errors, [currentStep]: true })
        return
      }
    }

    setErrors({ ...errors, [currentStep]: false })

    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      await handleSubmit()
    }
  }

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
      setErrors({ ...errors, [currentStep - 1]: false })
    }
  }

  const handleSubmit = async () => {
    await onSubmit()
  }

  // const canGoNext = currentStep < steps.length - 1
  const canGoPrevious = currentStep > 0
  const isLastStep = currentStep === steps.length - 1

  return (
    <div className={cn("space-y-8", className)}>
      {/* Progress Bar */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium text-foreground">
                Passo {currentStep + 1} de {steps.length}
              </span>
              <span className="font-semibold text-primary">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
        </CardContent>
      </Card>

      {/* Stepper */}
      <Card className="border-border/50">
        <CardContent className="pt-6">
          <Stepper steps={stepTitles} currentStep={currentStep} />
        </CardContent>
      </Card>

      {/* Step Content */}
      <div className="min-h-[400px]">
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">{steps[currentStep].title}</h3>
          {steps[currentStep].description && (
            <p className="text-sm text-muted-foreground">
              {steps[currentStep].description}
            </p>
          )}
        </div>

        {errors[currentStep] && (
          <div className="mb-4 p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
            <span className="font-semibold">⚠️</span>
            <span>Por favor, preencha todos os campos obrigatórios deste passo.</span>
          </div>
        )}

        <div className="space-y-4">{steps[currentStep].content}</div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between pt-6 border-t border-border">
        <div>
          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="shadow-sm"
            >
              Cancelar
            </Button>
          )}
        </div>

        <div className="flex items-center gap-3">
          {canGoPrevious && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevious}
              disabled={isLoading}
              className="shadow-sm"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Anterior
            </Button>
          )}

          <Button
            type="button"
            onClick={handleNext}
            disabled={isLoading}
            className="min-w-[140px] shadow-md"
          >
            {isLoading ? (
              "Processando..."
            ) : isLastStep ? (
              submitLabel
            ) : (
              <>
                Próximo
                <ChevronRight className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
