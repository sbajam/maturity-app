<script setup lang="ts">
// Final wizard step showing the completed assessment results and a link to the full report.
import type {
  Assessment,
  Capability,
  CapabilityAssessment,
  CapabilityEvidenceMapping,
  Evidence,
} from "~/types"
import { formatScore } from "~/utils/maturity"

defineProps<{
  assessment: Assessment
  capabilities: Capability[]
  capabilityAssessments: CapabilityAssessment[]
  mappings: CapabilityEvidenceMapping[]
  evidence: Evidence[]
  recommendations: string[]
  enterpriseId: number
}>()
</script>

<template>
  <div class="space-y-6">
    <div class="rounded-xl border border-green-200 bg-green-50/50 px-5 py-4">
      <div class="flex items-center gap-3">
        <div class="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
          <Icon name="lucide:check" class="h-5 w-5 text-white" />
        </div>
        <div>
          <h3 class="font-semibold text-green-800">
            Assessment Complete
          </h3>
          <p class="text-sm text-green-700">
            Overall maturity score:
            <strong>{{ formatScore(assessment.overallScore) }}</strong>
          </p>
        </div>
      </div>
    </div>

    <AssessmentResults
      :capabilities="capabilities"
      :assessments="capabilityAssessments"
      :mappings="mappings"
      :evidence="evidence"
      :recommendations="recommendations"
    />

    <div class="flex justify-end gap-3 border-t border-slate-100 pt-6">
      <NuxtLink :to="`/enterprise/${enterpriseId}/assessments`">
        <UiButton variant="ghost">
          Back to Assessments
        </UiButton>
      </NuxtLink>

      <NuxtLink
        :to="`/enterprise/${enterpriseId}/assessments/${assessment.id}/report`"
      >
        <UiButton>
          <Icon name="lucide:file-text" class="h-4 w-4" />
          View Full Report
        </UiButton>
      </NuxtLink>
    </div>
  </div>
</template>
