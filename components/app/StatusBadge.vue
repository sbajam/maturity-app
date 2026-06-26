<script setup lang="ts">
import type {
    AssessmentStatus,
    PipelineStatus,
} from "~/types"

type Status = AssessmentStatus | PipelineStatus

const props = defineProps<{
    status: Status
}>()

const badge = computed(() => {
    switch (props.status) {
        case "completed":
            return {
                label: "Completed",
                class:
                    "bg-emerald-100 text-emerald-700 border border-emerald-200",
                icon: "lucide:circle-check",
            }

        case "running":
            return {
                label: "Running",
                class:
                    "bg-blue-100 text-blue-700 border border-blue-200",
                icon: "lucide:loader-circle",
            }

        case "failed":
            return {
                label: "Failed",
                class:
                    "bg-red-100 text-red-700 border border-red-200",
                icon: "lucide:circle-x",
            }

        case "draft":
        case "waiting":
        default:
            return {
                label: "Draft",
                class:
                    "bg-slate-100 text-slate-700 border border-slate-200",
                icon: "lucide:file-pen-line",
            }
    }
})
</script>

<template>
    <span :class="badge.class" class="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold">
        <Icon :name="badge.icon" size="14" :class="{
            'animate-spin': status === 'running',
        }" />

        {{ badge.label }}
    </span>
</template>