<script setup lang="ts">
// Recursive, click-to-expand capability tile that reveals its sub-capabilities inline.
import type { CapabilityAssessment } from "~/types"
import type { CapabilityNode } from "~/utils/capability"
import {
  formatScore,
  getMaturityTileClass,
} from "~/utils/maturity"

const props = defineProps<{
  node: CapabilityNode
  assessmentMap: Map<number, CapabilityAssessment>
  parentName?: string
}>()

const expanded = ref(false)

const assessment = computed(() =>
  props.assessmentMap.get(props.node.id),
)

const hasChildren = computed(() =>
  props.node.children.length > 0,
)

const cellClass = computed(() => {
  if (!assessment.value)
    return "border-slate-200 bg-slate-50 text-slate-500"

  return getMaturityTileClass(assessment.value.maturityLevel)
})

function toggle() {
  if (hasChildren.value)
    expanded.value = !expanded.value
}
</script>

<template>
  <div
    class="rounded-xl border p-4 transition-all"
    :class="[cellClass, expanded ? 'col-span-full' : '', hasChildren ? 'cursor-pointer' : '']"
    @click.stop="toggle"
  >
    <div class="flex items-center justify-between gap-3">
      <div class="flex min-w-0 items-center gap-2">
        <Icon
          v-if="hasChildren"
          :name="expanded ? 'lucide:chevron-down' : 'lucide:chevron-right'"
          class="h-4 w-4 shrink-0"
        />

        <span class="truncate font-semibold">
          {{ node.name }}
        </span>
      </div>

      <span
        v-if="assessment"
        class="shrink-0 rounded-lg bg-black/10 px-2.5 py-1 text-sm font-bold"
      >
        {{ formatScore(assessment.score) }}
      </span>

      <span
        v-else
        class="shrink-0 text-xs opacity-70"
      >
        —
      </span>
    </div>

    <div
      v-if="hasChildren && !expanded"
      class="mt-2 text-xs opacity-80"
    >
      {{ node.children.length }} sub-capabilities
    </div>

    <div
      v-if="expanded && hasChildren"
      class="mt-4 rounded-lg bg-black/5 p-3"
    >
      <div class="mb-3 flex items-center gap-3 text-xs font-medium opacity-80">
        <span class="h-px flex-1 bg-current opacity-30" />
        <span>Sub-capabilities of {{ node.name }}</span>
        <span class="h-px flex-1 bg-current opacity-30" />
      </div>

      <div class="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <CapabilityHeatmapNode
          v-for="child in node.children"
          :key="child.id"
          :node="child"
          :assessment-map="assessmentMap"
          :parent-name="node.name"
        />
      </div>
    </div>
  </div>
</template>
