// Data source type label lookup and the default list of selectable source types.
import type { DataSourceType } from "~/types"

const labels: Record<DataSourceType, string> = {
  clarity: "Microsoft Clarity",
  matomo: "Matomo Analytics",
  support: "Support Tickets",
  business_document: "Business Documentation",
  capability_excel: "Capability Excel",
  server_log: "Server Logs",
  event_log: "Event Logs",
  custom: "Custom",
}

export function getDataSourceLabel(
  type: DataSourceType,
) {
  return labels[type]
}

export const defaultDataSourceTypes: DataSourceType[] = [
  "clarity",
  "matomo",
  "support",
  "business_document",
  "capability_excel",
  "server_log",
  "event_log",
]
