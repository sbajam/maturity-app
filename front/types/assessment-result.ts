// Capability assessment (score/maturity/confidence/reasoning) result type.
import type { BaseEntity, ID } from "./common"

export type CapabilityAssessment =
  BaseEntity & {

    assessmentId: ID

    capabilityId: ID

    /** Likert scale 1-5 */
    score: number | null

    /** Maturity level 1-5 */
    maturityLevel: number | null

    /** 0-1 */
    confidence: number | null

    status?: "assessed" | "insufficient_evidence"
    reasoning: string
}