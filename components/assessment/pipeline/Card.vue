<script setup lang="ts">
import type { AssessmentPipeline } from "~/types"

defineProps<{
  pipeline: AssessmentPipeline[]
}>()
</script>

<template>
  <AppCard>
    <!-- Header -->

    <div class="mb-8 flex items-start justify-between">
      <div>
        <h2 class="text-xl font-semibold text-slate-900">
          Assessment Pipeline
        </h2>

      
      </div>

      <UiBadge variant="primary">
        {{ pipeline.length }} Steps
      </UiBadge>
    </div>

    <!-- Empty -->

    <div
      v-if="pipeline.length === 0"
      class="rounded-xl border border-dashed border-slate-300 py-12 text-center"
    >
      <Icon
        name="i-lucide-workflow"
        class="mx-auto h-10 w-10 text-slate-300"
      />

      <h3 class="mt-4 text-lg font-medium text-slate-800">
        No Pipeline
      </h3>

      <p class="mt-2 text-sm text-slate-500">
        Pipeline steps will appear here after creating an assessment.
      </p>
    </div>

    <!-- Pipeline -->

    <div
      v-else
      class="space-y-2"
    >
      <AssessmentPipelineStep
        v-for="(step,index) in pipeline"
        :key="step.id"
        :step="step"
        :is-last="index === pipeline.length - 1"
      />
    </div>
  </AppCard>
</template>