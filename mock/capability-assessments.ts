// Mock leaf capability assessment scores/reasoning and recommendations, plus template generators for new assessment runs.
import type { CapabilityAssessment } from "~/types"

export const mockCapabilityAssessmentsByAssessment: Record<
  number,
  CapabilityAssessment[]
> = {
  1: [
    {
      id: 1,
      assessmentId: 1,
      capabilityId: 4,
      score: 3.2,
      maturityLevel: 3,
      confidence: 0.88,
      reasoning:
        "High bounce rate and dead clicks indicate usability issues in report submission. Form abandonment suggests users struggle to complete the flow.",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 2,
      assessmentId: 1,
      capabilityId: 6,
      score: 3.5,
      maturityLevel: 4,
      confidence: 0.86,
      reasoning:
        "Support tickets reveal discoverability issues but resolution time is within acceptable range.",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 3,
      assessmentId: 1,
      capabilityId: 9,
      score: 4.1,
      maturityLevel: 4,
      confidence: 0.79,
      reasoning:
        "Good session duration and page views suggest users engage well with dashboards.",
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 4,
      assessmentId: 1,
      capabilityId: 12,
      score: 2.8,
      maturityLevel: 3,
      confidence: 0.72,
      reasoning:
        "Manual business rules and limited automation indicate early-stage workflow maturity.",
      createdAt: "",
      updatedAt: "",
    },
  ],
}

export const mockRecommendationsByAssessment: Record<
  number,
  string[]
> = {
  1: [
    "Improve report form discoverability by adding prominent navigation links.",
    "Reduce form abandonment by simplifying the submission flow.",
    "Implement automated workflow for recurring report submissions.",
    "Add in-app guidance for first-time report submitters.",
    "Monitor dead click hotspots and fix UI elements causing confusion.",
  ],
}

export function getTemplateCapabilityAssessments(
  assessmentId: number,
  startId: number,
): CapabilityAssessment[] {
  const template =
    mockCapabilityAssessmentsByAssessment[1] ?? []

  return template.map((item, index) => ({
    ...item,
    id: startId + index,
    assessmentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}

export function getTemplateRecommendations(
  assessmentId: number,
): string[] {
  return [
    ...(mockRecommendationsByAssessment[1] ?? []),
  ]
}
