import type {
  PipelineStatus,
  PipelineStep,
} from "~/types"

export function getPipelineStepLabel(
  step: PipelineStep,
) {
  const map = {
    collect_sources: "Collect Data Sources",

    extract_evidence: "Generate Evidence",

    mapping: "AI Capability Mapping",

    assessment: "Capability Assessment",

    aggregation: "Aggregate Parent Capabilities",

    report: "Generate Report",
  }

  return map[step]
}

export function getPipelineStepDescription(
  step: PipelineStep,
) {
  const map = {
    collect_sources:
      "Loading enterprise connected data.",

    extract_evidence:
      "Extracting evidence from sources.",

    mapping:
      "AI maps evidence to capabilities.",

    assessment:
      "Calculating capability maturity.",

    aggregation:
      "Aggregating parent capability scores.",

    report:
      "Preparing final report.",
  }

  return map[step]
}

export function getPipelineStatusLabel(
  status: PipelineStatus,
) {
  const map = {
    waiting: "Waiting",

    running: "Running",

    completed: "Completed",

    failed: "Failed",
  }

  return map[status]
}

export function getPipelineStatusVariant(
  status: PipelineStatus,
) {
  const map = {
    waiting: "neutral",

    running: "primary",

    completed: "success",

    failed: "danger",
  }

  return map[status]
}