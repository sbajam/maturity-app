<script setup lang="ts">
// Collapsible hierarchical tree view of capability maturity scores.
import type {
  Capability,
  CapabilityAssessment,
} from "~/types"
import { buildCapabilityTree } from "~/utils/capability"
import { formatScore } from "~/utils/maturity"

const props = defineProps<{
  capabilities: Capability[]
  assessments: CapabilityAssessment[]
}>()

const expandedIds = ref<Set<number>>(new Set())

const assessmentMap = computed(() => {
  const map = new Map<number, CapabilityAssessment>()

  for (const item of props.assessments)
    map.set(item.capabilityId, item)

  return map
})

const tree = computed(() =>
  buildCapabilityTree(props.capabilities),
)

function toggle(id: number) {
  if (expandedIds.value.has(id))
    expandedIds.value.delete(id)
  else
    expandedIds.value.add(id)
}
</script>

<template>
  <AppCard
    title="Capability Tree"
    description="Hierarchical view of capability maturity scores."
  >
    <div class="space-y-1">
      <CapabilityTreeNode
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :assessment-map="assessmentMap"
        :expanded-ids="expandedIds"
        :depth="0"
        @toggle="toggle"
      />
    </div>
  </AppCard>
</template>
