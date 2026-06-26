<script setup lang="ts">
import { navigation } from "~/constants/navigation";
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