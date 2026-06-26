import type { BaseEntity, ID } from "./common"

export const AssessmentStatuses = [
  "draft",
  "running",
  "completed",
  "failed",
] as const

export type AssessmentStatus =
  typeof AssessmentStatuses[number]

export type Assessment = BaseEntity & {
  enterpriseId: ID

  name: string

  description?: string

  status: AssessmentStatus

  overallScore?: number

  completedAt?: string
}