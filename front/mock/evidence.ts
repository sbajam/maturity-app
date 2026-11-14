// Mock evidence items extracted from data sources, plus a template generator for new assessment runs.
import type { Evidence } from "~/types"

export const mockEvidenceByAssessment: Record<
  number,
  Evidence[]
> = {
  1: [
    {
      id: 1,
      assessmentId: 1,
      dataSourceId: 1,
      title: "Bounce Rate",
      content: "82%",
      context: { page: "/report", device: "mobile" },
      metadata: { category: "UX Metric" },
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 2,
      assessmentId: 1,
      dataSourceId: 1,
      title: "Dead Click",
      content: "56",
      context: { page: "/report/submit" },
      metadata: { category: "UX Metric" },
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 3,
      assessmentId: 1,
      dataSourceId: 1,
      title: "Session Duration",
      content: "2m 14s",
      context: { page: "/dashboard" },
      metadata: { category: "Engagement" },
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 4,
      assessmentId: 1,
      dataSourceId: 3,
      title: "Support Ticket",
      content: "کاربران فرم گزارش را پیدا نمی‌کنند.",
      context: { channel: "support" },
      metadata: { priority: "high" },
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 5,
      assessmentId: 1,
      dataSourceId: 4,
      title: "Business Rule",
      content: "User can report only once.",
      context: {},
      metadata: {},
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 6,
      assessmentId: 1,
      dataSourceId: 2,
      title: "Page Views",
      content: "12,450",
      context: { page: "/dashboard" },
      metadata: { period: "30d" },
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 7,
      assessmentId: 1,
      dataSourceId: 3,
      title: "Avg Resolution Time",
      content: "4.2 days",
      context: {},
      metadata: { category: "Support" },
      createdAt: "",
      updatedAt: "",
    },
    {
      id: 8,
      assessmentId: 1,
      dataSourceId: 1,
      title: "Form Abandonment",
      content: "38%",
      context: { page: "/report/submit" },
      metadata: { category: "UX Metric" },
      createdAt: "",
      updatedAt: "",
    },
  ],
}

export function getTemplateEvidence(
  assessmentId: number,
  startId: number,
): Evidence[] {
  const template = mockEvidenceByAssessment[1] ?? []

  return template.map((item, index) => ({
    ...item,
    id: startId + index,
    assessmentId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }))
}
