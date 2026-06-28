<script setup lang="ts">
import type {
  Assessment,
  AssessmentPipeline,
} from "~/types"

defineProps<{
  assessment?: Assessment
  pipeline: AssessmentPipeline[]
}>()
</script>

<template>
  <EmptyAssessment v-if="!assessment" />

  <div
    v-else
    class="space-y-6"
  >
    <!-- Overview -->

    <AssessmentOverviewCard
      :assessment="assessment"
    />

    <!-- Pipeline -->

    <AssessmentPipelineCard
      :pipeline="pipeline"
    />

    <!--
      TODO(PR-C):
      AssessmentResultsCard
    -->

    <!--
      TODO(PR-D):
      AssessmentEvidenceCard
    -->

    <!--
      TODO(PR-E):
      CapabilityAssessmentCard
    -->

    <!--
      TODO(PR-F):
      Charts
    -->

    <!--
      TODO(PR-G):
      Report
    -->

  </div>
</template>