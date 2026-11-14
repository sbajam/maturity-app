<script setup lang="ts">
// Card summarizing average maturity, confidence, and capability count for the latest assessment.
import { average } from "~/utils/number"
import { formatScore, formatConfidence } from "~/utils/maturity"
import type {
  Assessment,
  CapabilityAssessment,
} from "~/types"

const props = defineProps<{
  assessment: Assessment
  capabilityAssessments: CapabilityAssessment[]
}>()

const averageMaturity = computed(() => {
  if (!props.capabilityAssessments.length)
    return "—"

  return average(
    props.capabilityAssessments.map(
      item => item.maturityLevel,
    ),
  ).toFixed(1)
})

const averageConfidence = computed(() => {
  if (!props.capabilityAssessments.length)
    return "—"

  return formatConfidence(
    average(
      props.capabilityAssessments.map(
        item => item.confidence,
      ),
      2,
    ),
  )
})
</script>

<template>
  <AppCard title="Assessment Summary" description="Calculated metrics from the latest assessment.">
    <div class="space-y-5">
      <AppDescriptionItem label="Overall Score" icon="lucide:badge-percent">
        {{ formatScore(assessment.overallScore) }}
      </AppDescriptionItem>

      <AppDescriptionItem label="Average Maturity" icon="lucide:layers-3">
        {{ averageMaturity }} / 5
      </AppDescriptionItem>

      <AppDescriptionItem label="Average Confidence" icon="lucide:shield-check">
        {{ averageConfidence }}
      </AppDescriptionItem>

      <AppDescriptionItem label="Capabilities Assessed" icon="lucide:boxes">
        {{ capabilityAssessments.length }}
      </AppDescriptionItem>
    </div>
  </AppCard>
</template>
