// Top-level sidebar navigation menu configuration.
import type { NavigationItem } from "~/types/navigation"

export const navigation: NavigationItem[] = [
  {
    title: "Dashboard",
    icon: "lucide:layout-dashboard",
    to: "/",
  },
  {
    title: "Enterprises",
    icon: "lucide:building-2",
    to: "/enterprise",
  },
]
