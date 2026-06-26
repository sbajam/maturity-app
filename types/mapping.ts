import type { BaseEntity, ID } from "./common"

export type CapabilityEvidenceMapping =
  BaseEntity & {

    assessmentId: ID

    capabilityId: ID

    evidenceId: ID

    confidence: number

    reasoning: string
}