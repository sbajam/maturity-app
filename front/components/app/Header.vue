<script setup lang="ts">
// Top app header containing breadcrumbs, search, notifications, and the user menu.
</script>

<template>
    <header class="flex h-16 items-center justify-between border-b border-slate-200 bg-white px-8">
        <div class="flex items-center gap-6">
            <AppBreadcrumb />
        </div>

        <div class="flex items-center gap-4">

            <AppSearch />

            <AppNotifications />

            <AppUserMenu />

        </div>
    </header>
</template>