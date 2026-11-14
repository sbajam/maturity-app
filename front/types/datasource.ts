// Data source entity type and supported data source type enum.
import type { BaseEntity, ID } from "./common"

export const DataSourceTypes = [
  "clarity",
  "matomo",
  "support",
  "business_document",
  "capability_excel",
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

  /** Business context text (business_document) */
  businessText?: string

  /** Uploaded file name (mock) */
  fileName?: string
}