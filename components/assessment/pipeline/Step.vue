<script setup lang="ts">
import type { AssessmentPipeline } from "~/types"

const props = defineProps<{
    step: AssessmentPipeline
    isLast?: boolean
}>()

const icon = computed(() => {
    switch (props.step.status) {
        case "completed":
            return "fa6-solid:check"

        case "running":
            return "fa6-solid:spinner"

        case "failed":
            return "fa6-solid:x"

        default:
            return "mdi:clock-outline"
    }
})

const iconClass = computed(() => {
    switch (props.step.status) {
        case "completed":
            return "bg-green-500 text-white"

        case "running":
            return "bg-blue-500 text-white"

        case "failed":
            return "bg-red-500 text-white"

        default:
            return "border-2 border-slate-300 bg-white text-slate-400"
    }
})
</script>

<template>
    <div>
        <div class="bg-green-500 text-white "></div>
        <div class="bg-blue-500 text-white "></div>
        <div class="bg-red-500 text-white "></div>
    </div>
    <div class="border-2 border-slate-300 bg-white text-slate-400 "></div>
    <div class="relative flex gap-5 pb-8">
        <!-- Timeline -->

        <div class="flex w-12 flex-col items-center">
            <div :class="iconClass" class="flex h-11 w-11 items-center justify-center rounded-full shadow-sm">
                <Icon :name="icon" class="h-5 w-5" :class="{
                    'animate-spin': step.status === 'running',
                }" />
            </div>

            <div v-if="!isLast" class="mt-2 h-full w-px bg-slate-200" />
        </div>

        <!-- Content -->

        <div
            class="flex-1 rounded-xl border border-slate-200 px-4 py-2 transition hover:border-blue-300 hover:shadow-sm">
            <div class="flex items-start justify-between gap-4">
                <div>
                    <h3 class="font-semibold text-slate-900">
                        {{ getPipelineStepLabel(step.step) }}
                    </h3>

                    <p class="mt-1 text-sm leading-6 text-slate-500">
                        {{ getPipelineStepDescription(step.step) }}
                    </p>
                </div>

                <UiBadge :variant="getPipelineStatusVariant(step.status)">
                    {{ getPipelineStatusLabel(step.status) }}
                </UiBadge>
            </div>

            <div class="mt-5 flex flex-wrap gap-6 text-sm text-slate-500">
                <div>
                    <span class="font-medium text-slate-700">
                        Started
                    </span>

                    <div class="mt-1">
                        {{ step.startedAt ?? "—" }}
                    </div>
                </div>

                <div>
                    <span class="font-medium text-slate-700">
                        Finished
                    </span>

                    <div class="mt-1">
                        {{ step.completedAt ?? "—" }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>