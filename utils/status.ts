import type {
    AssessmentStatus,
    BadgeVariant,
    PipelineStatus,
} from "~/types"

export function getAssessmentStatusLabel(
    status: AssessmentStatus,
) {
    const map = {
        draft: "Draft",
        running: "Running",
        completed: "Completed",
        failed: "Failed",
    }

    return map[status]
}

export function getAssessmentStatusVariant(
    status: AssessmentStatus,
) {
    const map = {
        draft: "neutral",
        running: "primary",
        completed: "success",
        failed: "danger",
    }

    return map[status]
}

export function getEnabledVariant(
    enabled: boolean,
): BadgeVariant {
    return enabled
        ? "success"
        : "neutral"
}

export function getEnabledLabel(
    enabled: boolean,
) {
    return enabled
        ? "Enabled"
        : "Disabled"
}