<script setup lang="ts">
// Card summarizing the enterprise's most recently completed assessment.
import { getAssessmentStatusLabel, getAssessmentStatusVariant } from "~/utils/status"
import { formatDate } from "~/utils/date"
import { formatScore } from "~/utils/maturity"
import type { Assessment } from "~/types"

defineProps<{
  assessment: Assessment
}>()
</script>

<template>
  <AppCard title="Latest Assessment" description="Most recent assessment performed for this enterprise.">
    <div class="space-y-5">
      <AppDescriptionItem label="Assessment" icon="lucide:clipboard-check">
        {{ assessment.name }}
      </AppDescriptionItem>

      <AppDescriptionItem label="Status" icon="lucide:activity">
        <UiBadge :variant="getAssessmentStatusVariant(assessment.status)">
          {{ getAssessmentStatusLabel(assessment.status) }}
        </UiBadge>
      </AppDescriptionItem>

      <AppDescriptionItem label="Overall Score" icon="lucide:badge-percent">
        {{ formatScore(assessment.overallScore) }}
      </AppDescriptionItem>

      <AppDescriptionItem label="Completed At" icon="lucide:calendar-check">
        {{ formatDate(assessment.completedAt) }}
      </AppDescriptionItem>
    </div>

    <template v-if="assessment.description" #footer>
      <div class="border-t border-slate-100 px-6 py-5">
        <h3 class="mb-2 text-sm font-semibold text-slate-900">
          Description
        </h3>

        <p
          class="break-words whitespace-pre-wrap text-sm leading-7 text-slate-600"
          dir="auto"
        >
          {{ assessment.description }}
        </p>
      </div>
    </template>
  </AppCard>
</template>
