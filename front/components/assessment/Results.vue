<script setup lang="ts">
// Aggregates capability tree, heatmap, score table, evidence, AI reasoning, and recommendations for a completed assessment.
import type {
  Capability,
  CapabilityAssessment,
  CapabilityEvidenceMapping,
  Evidence,
} from "~/types"
import { getLeafCapabilities } from "~/utils/capability"
import { formatScore } from "~/utils/maturity"

const props = defineProps<{
  capabilities: Capability[]
  assessments: CapabilityAssessment[]
  mappings: CapabilityEvidenceMapping[]
  evidence: Evidence[]
  recommendations: string[]
}>()

const leafIds = computed(() => new Set(
  getLeafCapabilities(props.capabilities).map(c => c.id),
))

const leafAssessments = computed(() =>
  props.assessments.filter(item =>
    leafIds.value.has(item.capabilityId),
  ),
)

function getCapabilityName(id: number) {
  return props.capabilities.find(c => c.id === id)?.name
    ?? `Capability #${id}`
}
</script>

<template>
  <div class="space-y-6">
        <CapabilityTree
          :capabilities="capabilities"
          :assessments="assessments"
        />

        <CapabilityHeatmap
          :capabilities="capabilities"
          :assessments="assessments"
        />

    <CapabilityScoreTable
      :capabilities="capabilities"
      :assessments="assessments"
      :mappings="mappings"
    />

    <AppCard
      title="Evidence Summary"
      description="All evidence extracted during this assessment."
    >
      <div class="space-y-3">
        <div
          v-for="item in evidence"
          :key="item.id"
          class="rounded-lg border border-slate-100 bg-slate-50 p-4"
        >
          <div class="flex items-start justify-between gap-4">
            <h4 class="font-medium text-slate-900">
              {{ item.title }}
            </h4>
            <span class="shrink-0 text-xs text-slate-500">
              Source #{{ item.dataSourceId }}
            </span>
          </div>
          <p
            class="mt-1 text-sm text-slate-600"
            dir="auto"
          >
            {{ item.content }}
          </p>
        </div>
      </div>
    </AppCard>

    <AppCard
      title="AI Reasoning"
      description="AI-generated capability assessments for leaf capabilities."
    >
      <div class="space-y-4">
        <div
          v-for="item in leafAssessments"
          :key="item.id"
          class="rounded-lg border border-slate-100 p-4"
        >
          <div class="flex items-center justify-between">
            <h4 class="font-medium text-slate-900">
              {{ getCapabilityName(item.capabilityId) }}
            </h4>
            <span class="text-sm font-semibold text-blue-600">
              {{ formatScore(item.score) }}
            </span>
          </div>
          <p class="mt-2 text-sm leading-6 text-slate-600">
            {{ item.reasoning }}
          </p>
        </div>
      </div>
    </AppCard>

    <AppCard
      title="Recommendations"
      description="Suggested improvements based on assessment results."
    >
      <ul class="space-y-2">
        <li
          v-for="(rec, index) in recommendations"
          :key="index"
          class="flex gap-3 text-sm text-slate-700"
        >
          <span class="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-600">
            {{ index + 1 }}
          </span>
          <span dir="auto">{{ rec }}</span>
        </li>
      </ul>
    </AppCard>
  </div>
</template>
