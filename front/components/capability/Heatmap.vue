<script setup lang="ts">
// Root of the capability heatmap; renders top-level capability tiles with a color legend.
import type {
  Capability,
  CapabilityAssessment,
} from "~/types"
import { buildCapabilityTree } from "~/utils/capability"

const props = defineProps<{
  capabilities: Capability[]
  assessments: CapabilityAssessment[]
}>()

const assessmentMap = computed(() => {
  const map = new Map<number, CapabilityAssessment>()

  for (const item of props.assessments)
    map.set(item.capabilityId, item)

  return map
})

const tree = computed(() =>
  buildCapabilityTree(props.capabilities),
)
</script>

<template>
  <AppCard
    title="Capability Heatmap"
    description="Click a capability to drill into its sub-capabilities."
  >
    <div class="mb-4 flex flex-wrap items-center gap-4 text-xs text-slate-600">
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded-sm bg-red-500" />
        Low (L1)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded-sm bg-orange-500" />
        Developing (L2)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded-sm bg-amber-400" />
        Maturing (L3)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded-sm bg-green-500" />
        Advanced (L4+)
      </span>
      <span class="flex items-center gap-1.5">
        <span class="h-3 w-3 rounded-sm bg-slate-100 ring-1 ring-inset ring-slate-300" />
        No data
      </span>
    </div>

    <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      <CapabilityHeatmapNode
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :assessment-map="assessmentMap"
      />
    </div>
  </AppCard>
</template>
