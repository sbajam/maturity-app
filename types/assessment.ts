// Assessment entity type and status enum.
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

  version: string

  status: AssessmentStatus

  /** Likert scale 1-5 */
  overallScore?: number

  completedAt?: string
}