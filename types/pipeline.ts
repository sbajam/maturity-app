import type { BaseEntity, ID } from "./common"

export const PipelineSteps = [
  "collect_sources",
  "extract_evidence",
  "mapping",
  "assessment",
  "aggregation",
  "report",
] as const

export type PipelineStep =
  typeof PipelineSteps[number]

export const PipelineStatuses = [
  "waiting",
  "running",
  "completed",
  "failed",
] as const

export type PipelineStatus =
  typeof PipelineStatuses[number]

export type AssessmentPipeline =
  BaseEntity & {

    assessmentId: ID

    step: PipelineStep

    status: PipelineStatus

    startedAt?: string

    completedAt?: string
}