import type { DataSourceType } from "~/types"

const labels: Record<DataSourceType, string> = {
    clarity: "Microsoft Clarity",

    matomo: "Matomo Analytics",

    business_document: "Business Document",

    capability_document: "Capability Document",

    support_ticket: "Support Ticket",

    customer_feedback: "Customer Feedback",

    server_log: "Server Log",

    event_log: "Event Log",

    custom: "Custom",
}

export function getDataSourceLabel(
    type: DataSourceType,
) {
    return labels[type]
}