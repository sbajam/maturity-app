// Assessment wizard step enum and mapping review status type.
export const WizardSteps = [
  "review",
  "evidence",
  "ai_analysis",
  "results",
] as const

export type WizardStep = typeof WizardSteps[number]

export type MappingReviewStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "irrelevant"
