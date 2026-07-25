<script setup lang="ts">
// Assessment detail panel showing overview, pipeline progress, and run/report actions.
import type {
  Assessment,
  AssessmentPipeline,
  CapabilityEvidenceMapping,
  Evidence,
} from "~/types"

const props = defineProps<{
  assessment?: Assessment
  pipeline: AssessmentPipeline[]
  evidence: Evidence[]
  mappings: CapabilityEvidenceMapping[]
  enterpriseId: number
  isRunning?: boolean
}>()

const canRun = computed(() =>
  props.assessment
  && (props.assessment.status === "draft"
    || props.assessment.status === "failed")
  && !props.isRunning,
)

const canViewReport = computed(() =>
  props.assessment?.status === "completed",
)

const runUrl = computed(() =>
  props.assessment
    ? `/enterprise/${props.enterpriseId}/assessments/${props.assessment.id}/run`
    : "#",
)

const reportUrl = computed(() =>
  props.assessment
    ? `/enterprise/${props.enterpriseId}/assessments/${props.assessment.id}/report`
    : "#",
)
</script>

<template>
  <UiEmptyState
    v-if="!assessment"
    title="No Assessment Selected"
    description="Select an assessment from the list or create a new one."
    icon="lucide:clipboard-list"
  />

  <div
    v-else
    class="space-y-6"
  >
    <AssessmentCard :assessment="assessment" />

    <div class="flex flex-wrap gap-3">
      <NuxtLink
        v-if="canRun"
        :to="runUrl"
      >
        <UiButton>
          <Icon name="lucide:play" class="h-4 w-4" />
          Run Assessment
        </UiButton>
      </NuxtLink>

      <NuxtLink
        v-if="canViewReport"
        :to="reportUrl"
      >
        <UiButton variant="outline">
          <Icon name="lucide:file-text" class="h-4 w-4" />
          View Full Report
        </UiButton>
      </NuxtLink>

      <NuxtLink
        v-if="assessment.status === 'running'"
        :to="runUrl"
      >
        <UiButton variant="outline">
          <Icon name="lucide:workflow" class="h-4 w-4" />
          Continue Pipeline
        </UiButton>
      </NuxtLink>
    </div>

    <AssessmentPipelineCard
      v-if="pipeline.length > 0"
      :pipeline="pipeline"
      :evidence="evidence"
      :mappings="mappings"
    />

    <UiEmptyState
      v-else-if="canRun"
      title="Ready to Run"
      description="Start the assessment pipeline to review capabilities, evidence, and generate results."
      icon="lucide:play-circle"
    >
      <NuxtLink :to="runUrl">
        <UiButton class="mt-4">
          <Icon name="lucide:play" class="h-4 w-4" />
          Start Assessment Pipeline
        </UiButton>
      </NuxtLink>
    </UiEmptyState>
  </div>
</template>
