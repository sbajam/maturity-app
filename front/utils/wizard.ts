// Wizard step configuration, progress calculation, and AI loading message list.
import type { WizardStep } from "~/types"

export const WIZARD_STEPS: {
  id: WizardStep
  label: string
  description: string
}[] = [
  {
    id: "review",
    label: "Review Setup",
    description: "Capabilities, data sources & business context",
  },
  {
    id: "evidence",
    label: "Evidence & Mapping",
    description: "Review extracted evidence and AI mappings",
  },
  {
    id: "ai_analysis",
    label: "AI Analysis",
    description: "Capability maturity assessment",
  },
  {
    id: "results",
    label: "Results",
    description: "Final assessment report",
  },
]

export function getWizardStepIndex(step: WizardStep) {
  return WIZARD_STEPS.findIndex(item => item.id === step)
}

export function getWizardProgress(step: WizardStep) {
  const index = getWizardStepIndex(step)
  return Math.round(((index + 1) / WIZARD_STEPS.length) * 100)
}

export const AI_LOADING_MESSAGES = [
  "Connecting to AI assessment engine...",
  "Analyzing approved evidence patterns...",
  "Evaluating leaf capability maturity levels...",
  "Aggregating parent capability scores...",
  "Generating recommendations...",
  "Finalizing assessment report...",
]
