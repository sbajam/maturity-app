// Capability-to-evidence mapping entity type produced by the AI mapping step.
import type { BaseEntity, ID } from "./common"
import type { MappingReviewStatus } from "./wizard"

export type CapabilityEvidenceMapping =
  BaseEntity & {

    assessmentId: ID

    capabilityId: ID

    evidenceId: ID

    /** 0-1 */
    confidence: number

    reasoning: string

    /** @deprecated use reviewStatus */
    approved?: boolean

    reviewStatus?: MappingReviewStatus
}