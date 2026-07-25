// Mock assessment records for the default enterprise.
import type { Assessment } from "~/types"
import { mockEnterprise } from "./enterprise"

export const mockAssessments: Assessment[] = [
  {
    id: 1,
    enterpriseId: mockEnterprise.id,
    name: "Initial Assessment",
    description: "Initial enterprise capability assessment.",
    version: "1.0",
    status: "completed",
    overallScore: 3.8,
    completedAt: "2026-02-10T10:15:00Z",
    createdAt: "2026-02-09T10:00:00Z",
    updatedAt: "2026-02-10T10:15:00Z",
  },
  {
    id: 2,
    enterpriseId: mockEnterprise.id,
    name: "Sprint 1 Assessment",
    description: "Evaluation after Sprint 1 improvements.",
    version: "1.1",
    status: "running",
    createdAt: "2026-03-05T14:00:00Z",
    updatedAt: "2026-03-05T14:11:00Z",
  },
  {
    id: 3,
    enterpriseId: mockEnterprise.id,
    name: "June Assessment",
    description: "Quarterly maturity assessment.",
    version: "2.0",
    status: "draft",
    createdAt: "2026-06-01T09:00:00Z",
    updatedAt: "2026-06-01T09:00:00Z",
  },
]
