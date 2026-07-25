<script setup lang="ts">
// Flat data table of maturity scores, confidence, and evidence count across all capability levels.
import type {
  Capability,
  CapabilityAssessment,
  CapabilityEvidenceMapping,
  DataTableColumn,
} from "~/types"
import { countEvidenceForCapability } from "~/utils/capability"
import {
  formatConfidence,
  formatScore,
  getMaturityBadgeVariant,
} from "~/utils/maturity"

type ScoreRow = {
  id: number
  name: string
  level: number
  score: number
  maturityLevel: number
  confidence: number
  evidenceCount: number
  isLeaf: boolean
}

const props = defineProps<{
  capabilities: Capability[]
  assessments: CapabilityAssessment[]
  mappings: CapabilityEvidenceMapping[]
}>()

const parentIds = computed(() => new Set(
  props.capabilities
    .map(item => item.parentId)
    .filter((id): id is number => id !== null),
))

const rows = computed<ScoreRow[]>(() => {
  const assessmentMap = new Map(
    props.assessments.map(item => [
      item.capabilityId,
      item,
    ]),
  )

  return props.capabilities
    .map((capability) => {
      const assessment = assessmentMap.get(capability.id)

      if (!assessment)
        return null

      return {
        id: capability.id,
        name: capability.name,
        level: capability.level,
        maturityLevel: assessment.maturityLevel,
        score: assessment.score,
        confidence: assessment.confidence,
        evidenceCount: countEvidenceForCapability(
          capability.id,
          props.mappings,
        ),
        isLeaf: !parentIds.value.has(capability.id),
      }
    })
    .filter((item): item is ScoreRow => item !== null)
    .sort((a, b) => a.level - b.level || a.name.localeCompare(b.name))
})

const columns: DataTableColumn<ScoreRow>[] = [
  { id: "name", accessor: "name", label: "Capability" },
  { id: "level", accessor: "level", label: "Level", width: "80px" },
  { id: "score", label: "Score", width: "100px" },
  { id: "maturity", label: "Maturity", width: "100px" },
  { id: "confidence", label: "Confidence", width: "110px" },
  { id: "evidence", label: "Evidence", width: "100px" },
]
</script>

<template>
  <UiDataTable
    :columns="columns"
    :items="rows"
    empty-title="No Scores"
    empty-description="Capability scores will appear after assessment completes."
  >
    <template #toolbar>
      <div>
        <h2 class="text-xl font-semibold text-slate-900">
          Capability Scores
        </h2>
        <p class="mt-1 text-sm text-slate-500">
          Maturity scores across all capability levels.
        </p>
      </div>
    </template>

    <template #cell-name="{ row }">
      <div class="flex items-center gap-2">
        <span
          class="inline-block w-4"
          :style="{ marginLeft: `${(row.level - 1) * 16}px` }"
        />
        <span :class="row.isLeaf ? 'font-medium' : 'font-semibold'">
          {{ row.name }}
        </span>
      </div>
    </template>

    <template #cell-score="{ row }">
      <span class="font-medium text-blue-600">
        {{ formatScore(row.score) }}
      </span>
    </template>

    <template #cell-maturity="{ row }">
      <UiBadge :variant="getMaturityBadgeVariant(row.maturityLevel)">
        L{{ row.maturityLevel }}
      </UiBadge>
    </template>

    <template #cell-confidence="{ row }">
      {{ formatConfidence(row.confidence) }}
    </template>

    <template #cell-evidence="{ row }">
      {{ row.evidenceCount || "—" }}
    </template>
  </UiDataTable>
</template>
