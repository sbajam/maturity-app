<script setup lang="ts">
// Main navigation sidebar containing the logo, nav groups, and user menu.
import type { NavigationItem } from "~/types/navigation"

// Nuxt component-local configuration: navigation is only consumed by this Sidebar.
const navigation: NavigationItem[] = [
  { title: "Dashboard", icon: "lucide:layout-dashboard", to: "/" },
  { title: "Enterprises", icon: "lucide:building-2", to: "/enterprise" },
]
</script>

<template>
    <aside class="flex h-screen w-72 flex-col border-r border-slate-200 bg-white">
        <div class="border-b border-slate-200 p-6">
            <AppLogo />
        </div>

        <div class="flex-1 overflow-y-auto py-4">
            <AppSidebarGroup :items="navigation" />
        </div>

        <div class="border-t border-slate-200 p-4">
            <AppUserMenu />
        </div>
    </aside>
</template>