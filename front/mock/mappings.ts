// Mock AI evidence-to-capability mappings, plus a template generator for new assessment runs.
import type { CapabilityEvidenceMapping } from "~/types"

export const mockMappingsByAssessment: Record<
  number,
  CapabilityEvidenceMapping[]
> = {
  1: [
    {
      id: 1,
      assessmentId: 1,
      capabilityId: 4,
      evidenceId: 1,
      confidence: 0.92,
      reasoning:
        "Bounce Rate of Report Page directly reflects report submission usability.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 2,
      assessmentId: 1,
      capabilityId: 4,
      evidenceId: 2,
      confidence: 0.88,
      reasoning:
        "Dead clicks on submit button indicate users struggle to complete report submission.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 3,
      assessmentId: 1,
      capabilityId: 4,
      evidenceId: 8,
      confidence: 0.85,
      reasoning:
        "High form abandonment rate suggests friction in the report submission flow.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 4,
      assessmentId: 1,
      capabilityId: 6,
      evidenceId: 4,
      confidence: 0.94,
      reasoning:
        "Support tickets about report form discoverability directly relate to ticket resolution capability.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 5,
      assessmentId: 1,
      capabilityId: 6,
      evidenceId: 7,
      confidence: 0.78,
      reasoning:
        "Average resolution time indicates efficiency of support ticket handling.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 6,
      assessmentId: 1,
      capabilityId: 9,
      evidenceId: 3,
      confidence: 0.81,
      reasoning:
        "Session duration on dashboard reflects user engagement with analytics.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 7,
      assessmentId: 1,
      capabilityId: 9,
      evidenceId: 6,
      confidence: 0.76,
      reasoning:
        "Page views on dashboard indicate accessibility of analytics features.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 8,
      assessmentId: 1,
      capabilityId: 12,
      evidenceId: 5,
      confidence: 0.72,
      reasoning:
        "Business rule about single submission implies manual workflow constraints.",
      approved: true,
      createdAt: "",
      updatedAt: "",
    },
  ],
}

export function getTemplateMappings(
  assessmentId: number,
  startId: number,
): CapabilityEvidenceMapping[] {
  const template = mockMappingsByAssessment[1] ?? []

  return template.map((item, index) => ({
    ...item,
    id: startId + index,
    assessmentId,
    approved: undefined,
    reviewStatus: "pending" as const,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  })).filter(item => item.capabilityId !== 12)
}
