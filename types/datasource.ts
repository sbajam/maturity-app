import type { BaseEntity, ID } from "./common"

export const DataSourceTypes = [
  "clarity",
  "matomo",
  "business_document",
  "capability_document",
  "support_ticket",
  "customer_feedback",
  "server_log",
  "event_log",
  "custom",
] as const

export type DataSourceType = typeof DataSourceTypes[number]

export type DataSource = BaseEntity & {
  enterpriseId: ID

  name: string

  type: DataSourceType

  enabled: boolean

  description?: string
}