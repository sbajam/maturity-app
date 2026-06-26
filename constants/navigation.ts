import type { NavigationItem } from "~/types/navigation";

export const navigation: NavigationItem[] = [
    {
        title: "Dashboard",
        icon: "lucide:layout-dashboard",
        to: "/",
    },
    {
        title: "Enterprise",
        icon: "lucide:building-2",
        children: [
            {
                title: "Overview",
                to: "/enterprise/overview",
            },
            {
                title: "Data Sources",
                to: "/enterprise/data-sources",
            },
            {
                title: "Assessments",
                to: "/enterprise/assessments",
            },
        ],
    },
];