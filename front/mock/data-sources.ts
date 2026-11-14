// Mock data sources connected to the default enterprise.
import type { DataSource } from "~/types"
import { mockEnterprise } from "./enterprise"

export const mockDataSources: DataSource[] = [
  {
    id: 1,
    enterpriseId: mockEnterprise.id,
    name: "Microsoft Clarity",
    type: "clarity",
    enabled: true,
    description: "User behavior analytics from Microsoft Clarity.",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 2,
    enterpriseId: mockEnterprise.id,
    name: "Matomo Analytics",
    type: "matomo",
    enabled: true,
    description: "Web analytics platform.",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 3,
    enterpriseId: mockEnterprise.id,
    name: "Support Tickets",
    type: "support",
    enabled: true,
    description: "Customer support ticket system.",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 4,
    enterpriseId: mockEnterprise.id,
    name: "Business Documentation",
    type: "business_document",
    enabled: true,
    description: "Business rules and process documentation.",
    businessText:
      "Users can submit reports once per month. Report form must be accessible from the main dashboard.",
    fileName: "business-rules-v2.pdf",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-15T10:00:00Z",
  },
  {
    id: 5,
    enterpriseId: mockEnterprise.id,
    name: "Capability Excel",
    type: "capability_excel",
    enabled: false,
    description: "Capability framework definition file.",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
  {
    id: 6,
    enterpriseId: mockEnterprise.id,
    name: "Server Logs",
    type: "server_log",
    enabled: false,
    description: "Application server logs.",
    createdAt: "2026-01-10T08:00:00Z",
    updatedAt: "2026-01-10T08:00:00Z",
  },
]
