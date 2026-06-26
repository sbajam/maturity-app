import type {
    DataSourceType,
} from "~/types"

export function getDataSourceTypeLabel(
    type: DataSourceType,
) {
    const map = {
        clarity: "Microsoft Clarity",
        matomo: "Matomo",

        business_document:
            "Business Document",

        capability_document:
            "Capability Document",

        support_ticket:
            "Support Ticket",

        customer_feedback:
            "Customer Feedback",

        server_log: "Server Log",

        event_log: "Event Log",

        custom: "Custom",
    }

    return map[type]
}