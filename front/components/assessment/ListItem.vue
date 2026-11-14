<script setup lang="ts">
// Single assessment row used inside the assessment list.
import type { Assessment } from "~/types"
import {
  getAssessmentStatusLabel,
  getAssessmentStatusVariant,
} from "~/utils/status"
import { formatScore } from "~/utils/maturity"
import { formatDate } from "~/utils/date"

defineProps<{
  assessment: Assessment
  selected?: boolean
}>()
</script>

<template>
  <button
    type="button"
    class="w-full rounded-xl border p-4 text-left transition"
    :class="selected
      ? 'border-blue-500 bg-blue-50 shadow-sm'
      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'"
  >
    <div class="flex items-start justify-between gap-3">
      <div class="min-w-0 flex-1">
        <h3 class="truncate font-semibold text-slate-900">
          {{ assessment.name }}
        </h3>

        <p class="mt-1 text-xs text-slate-500">
          v{{ assessment.version }}
          ·
          {{ formatDate(assessment.createdAt) }}
        </p>
      </div>

      <UiBadge
        :variant="getAssessmentStatusVariant(assessment.status)"
      >
        {{ getAssessmentStatusLabel(assessment.status) }}
      </UiBadge>
    </div>

    <div
      v-if="assessment.overallScore"
      class="mt-3 text-sm font-medium text-blue-600"
    >
      {{ formatScore(assessment.overallScore) }}
    </div>
  </button>
</template>
