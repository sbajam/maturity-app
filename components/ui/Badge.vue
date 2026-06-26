<script setup lang="ts">
import type { BadgeVariant } from "~/types/ui"

const props = withDefaults(
    defineProps<{
        variant?: BadgeVariant
    }>(),
    {
        variant: "neutral",
    },
)

const classes = computed(() => {
    switch (props.variant) {
        case "primary":
            return "bg-blue-50 border border-blue-200 text-blue-700"

        case "success":
            return "bg-green-50 border border-green-200 text-green-700"

        case "warning":
            return "bg-amber-50 border border-amber-200 text-amber-700"

        case "danger":
            return "bg-red-50 border border-red-200 text-red-700"

        default:
            return "bg-slate-50 border border-slate-200 text-slate-700"
    }
})
</script>

<template>
    <span :class="classes" class="inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium">
        <slot />
    </span>
</template>