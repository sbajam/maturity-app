<script setup lang="ts">
// Single recursive row used inside the capability tree.
import type { CapabilityAssessment } from "~/types"
import {
  type CapabilityNode,
} from "~/utils/capability"
import {
  formatConfidence,
  formatScore,
  getMaturityColorClass,
} from "~/utils/maturity"

defineProps<{
  node: CapabilityNode
  assessmentMap: Map<number, CapabilityAssessment>
  expandedIds: Set<number>
  depth: number
}>()

const emit = defineEmits<{
  toggle: [id: number]
}>()
</script>

<template>
  <div>
    <button
      type="button"
      class="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition hover:bg-slate-50"
      :style="{ paddingLeft: `${depth * 20 + 12}px` }"
      @click="node.children.length ? emit('toggle', node.id) : undefined"
    >
      <Icon
        v-if="node.children.length"
        :name="expandedIds.has(node.id) ? 'lucide:chevron-down' : 'lucide:chevron-right'"
        class="h-4 w-4 shrink-0 text-slate-400"
      />

      <span
        v-else
        class="h-2 w-2 shrink-0 rounded-full"
        :class="assessmentMap.get(node.id)?.score !== null && assessmentMap.get(node.id)
          ? getMaturityColorClass(assessmentMap.get(node.id)!.maturityLevel)
          : 'bg-slate-300'"
      />

      <span class="flex-1 text-sm font-medium text-slate-800">
        {{ node.name }}
      </span>

      <template v-if="assessmentMap.get(node.id)">
        <span class="text-sm font-semibold text-blue-600">
          {{ formatScore(assessmentMap.get(node.id)!.score) }}
        </span>

        <span
          class="h-3 w-3 rounded-full"
          :class="getMaturityColorClass(
            assessmentMap.get(node.id)!.maturityLevel,
          )"
        />
      </template>
    </button>

    <template v-if="expandedIds.has(node.id)">
      <CapabilityTreeNode
        v-for="child in node.children"
        :key="child.id"
        :node="child"
        :assessment-map="assessmentMap"
        :expanded-ids="expandedIds"
        :depth="depth + 1"
        @toggle="emit('toggle', $event)"
      />
    </template>
  </div>
</template>
