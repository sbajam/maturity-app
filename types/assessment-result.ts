import type { BaseEntity, ID } from "./common"

export type CapabilityAssessment =
  BaseEntity & {

    assessmentId: ID

    capabilityId: ID

    score: number

    maturityLevel: number

    confidence: number

    reasoning: string
}