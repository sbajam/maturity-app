<script setup lang="ts">
// Placeholder shown when a list or section has no data.
defineProps<{
    title: string
    description?: string
    icon?: string
}>()
</script>

<template>
    <div
        class="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-8 py-14 text-center">
        <Icon :name="icon ?? 'i-lucide-folder-open'" size="42" class="mb-4 text-slate-400" />

        <h3 class="text-lg font-semibold text-slate-800">
            {{ title }}
        </h3>

        <p v-if="description" class="mt-2 max-w-md text-sm text-slate-500">
            {{ description }}
        </p>

        <div v-if="$slots.default" class="mt-6">
            <slot />
        </div>
    </div>
</template>