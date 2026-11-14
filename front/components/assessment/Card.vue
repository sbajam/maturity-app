<script setup lang="ts">
// Assessment overview card showing name, status, overall score, and completion date.
import type { Assessment } from "~/types"
import { formatScore } from "~/utils/maturity"
import { formatDate } from "~/utils/date"
import {
  getAssessmentStatusLabel,
  getAssessmentStatusVariant,
} from "~/utils/status"

defineProps<{
  assessment: Assessment
}>()
</script>

<template>
  <AppCard>
    <div class="flex flex-col gap-8 lg:flex-row lg:justify-between">
      <div class="flex-1">
        <div class="flex items-center gap-3">
          <div
            class="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100"
          >
            <Icon
              name="i-lucide-clipboard-list"
              class="h-6 w-6 text-blue-600"
            />
          </div>

          <div>
            <h1 class="text-2xl font-semibold text-slate-900">
              {{ assessment.name }}
            </h1>

            <p class="mt-1 text-sm text-slate-500">
              v{{ assessment.version }} · Assessment Overview
            </p>
          </div>
        </div>

        <p
          class="mt-6 max-w-3xl leading-7 text-slate-600"
          dir="auto"
        >
          {{
            assessment.description
            || "No description has been provided for this assessment."
          }}
        </p>
      </div>

      <div class="flex items-start">
        <UiBadge
          :variant="getAssessmentStatusVariant(assessment.status)"
        >
          {{ getAssessmentStatusLabel(assessment.status) }}
        </UiBadge>
      </div>
    </div>

    <div
      class="mt-8 grid grid-cols-1 gap-4 border-t border-slate-200 pt-6 md:grid-cols-3"
    >
      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Overall Score
        </p>

        <div class="mt-2 text-4xl font-bold text-blue-600">
          {{ formatScore(assessment.overallScore) }}
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Current Status
        </p>

        <div class="mt-3">
          <UiBadge
            :variant="getAssessmentStatusVariant(assessment.status)"
          >
            {{ getAssessmentStatusLabel(assessment.status) }}
          </UiBadge>
        </div>
      </div>

      <div>
        <p class="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Completed At
        </p>

        <p class="mt-3 font-medium text-slate-800">
          {{
            assessment.completedAt
              ? formatDate(assessment.completedAt)
              : "Not completed yet"
          }}
        </p>
      </div>
    </div>
  </AppCard>
</template>
